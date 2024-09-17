package it.polito.communication_manager.route

import com.google.api.services.gmail.model.Message
import it.polito.communication_manager.dto.Channel
import it.polito.communication_manager.dto.MessageDTO
import jakarta.mail.Multipart
import jakarta.mail.Session
import jakarta.mail.internet.InternetAddress
import jakarta.mail.internet.MimeBodyPart
import jakarta.mail.internet.MimeMessage
import jakarta.mail.internet.MimeMultipart
import org.apache.camel.EndpointInject
import org.apache.camel.builder.RouteBuilder
import org.apache.camel.component.google.mail.GoogleMailEndpoint
import org.apache.camel.model.dataformat.JsonLibrary
import org.springframework.stereotype.Component
import java.io.ByteArrayInputStream
import java.io.File
import java.io.FileOutputStream
import java.time.Instant
import java.time.ZoneId
import java.util.*

@Component
class MyRouteBuilder : RouteBuilder() {
    @EndpointInject("google-mail:messages/get")
    lateinit var ep: GoogleMailEndpoint

    override fun configure() {
        // Exception handling
        onException(Exception::class.java)
            .log("Exception occurred: \${exception.message}")
            .handled(true)
            .end()

        from("google-mail-stream:0?markAsRead=true&scopes=https://mail.google.com")
            .routeId("gmail-to-cmr_microservice")
            .process { it ->
                val id = it.getIn().getHeader("CamelGoogleMailId").toString()
                val message = ep.client.users().messages().get("me", id).execute()
                val subject =
                    message.payload.headers.find { e -> e.name.equals("subject", true) }?.get("value")?.toString() ?: ""

                val from =
                    message.payload.headers.find { e -> e.name.equals("from", true) }?.get("value")?.toString() ?: ""
                val email = from.substringAfter("<").substringBefore(">")

                val date =
                    Instant.ofEpochMilli(it.getIn().messageTimestamp).atZone(ZoneId.systemDefault()).toLocalDateTime()
                        .toString()

                val rawMessage = ep.client.users().messages().get("me", id).setFormat("raw").execute()
                val bodyBase64 = rawMessage.raw
                val base64Standard = bodyBase64.replace('-', '+').replace('_', '/').replace("\\s".toRegex(), "")

                try {
                    val bodyBytes = Base64.getDecoder().decode(base64Standard)
                    val inputStream = ByteArrayInputStream(bodyBytes)
                    val session = Session.getDefaultInstance(Properties())
                    val mimeMessage = MimeMessage(session, inputStream)

                    var foundAttachment = false
                    val messageBody: String = when (val content = mimeMessage.content) {
                        is String -> content // For simple text/plain emails
                        is Multipart -> {
                            val multipart = content as Multipart
                            var textContent: String? = null

                            val textParts = (0 until multipart.count).map { multipart.getBodyPart(it) }

                            textParts.forEach { e ->
                                if (e.contentType.startsWith("application/")) {
                                    foundAttachment = true
                                }

                                println(e.contentType)
                            }

                            // Handle multipart/alternative and extract text
                            for (i in 0 until multipart.count) {
                                val part = multipart.getBodyPart(i)
                                val contentType = part.contentType.toLowerCase()

                                if (contentType.startsWith("multipart/alternative")) {
                                    val subMultipart = part.content as Multipart
                                    for (j in 0 until subMultipart.count) {
                                        val subPart = subMultipart.getBodyPart(j)
                                        val subContentType = subPart.contentType.toLowerCase()
                                        if (subContentType.startsWith("text/plain") || subContentType.startsWith("text/html")) {
                                            textContent = subPart.content.toString()
                                            break
                                        }
                                    }
                                    if (textContent != null) break
                                } else if (contentType.startsWith("text/plain") || contentType.startsWith("text/html")) {
                                    textContent = part.content.toString()
                                } else if (contentType.startsWith("application/")) {
                                    foundAttachment = true
                                }
                            }
                            textContent ?: "No text content found"
                        }

                        else -> "Unsupported content type"
                    }

                    val messageDTO =
                        MessageDTO(null, email, date, subject, messageBody, Channel.Email, 0, foundAttachment)

                    it.getIn().body = messageDTO
                } catch (e: Exception) {
                    e.printStackTrace()
                    it.getIn().body = "Error processing email body: ${e.message}"
                }
            }
            .marshal()
            .json(JsonLibrary.Jackson)
            .setHeaders("Content-Type", constant("application/json"))
            .to("http://localhost:8080/api/messages")
            .onCompletion()
            .log("Correct delivery of incoming e-mail")
            .end()

        from("direct:sendEmail")
            .routeId("send-email-route")
            .process { exchange ->
                val destinationEmail = exchange.getIn().getHeader("to", String::class.java)
                val subject = exchange.getIn().getHeader("subject", String::class.java)
                val body = exchange.getIn().body as String

                val rawMessage = "To: $destinationEmail\nSubject: $subject\n\n$body"
                val encodedEmail = Base64.getUrlEncoder().encodeToString(rawMessage.toByteArray())

                val message = Message().apply {
                    raw = encodedEmail
                }

                // Set the headers and body for the Google Mail endpoint
                exchange.getIn().setHeader("CamelGoogleMailContent", message)
                exchange.getIn().setHeader("CamelGoogleMailUserId", "me")
                exchange.getIn().body = message
            }
            .to("google-mail:messages/send")
            .log("Email sent to: \${header.to}")

        from("direct:sendEmailWithAttachment")
            .routeId("send-email-with-attachment-route")
            .process { exchange ->
                val destinationEmail = exchange.getIn().getHeader("to", String::class.java)
                val subject = exchange.getIn().getHeader("subject", String::class.java)
                val bodyText = exchange.getIn().body as String
                val attachmentData = exchange.getIn().getHeader("attachmentData", ByteArray::class.java)
                val attachmentFileName = exchange.getIn().getHeader("attachmentFileName", String::class.java)

                // Create a MimeMessage using the javax.mail library
                val props = Properties()
                val session = Session.getDefaultInstance(props, null)

                val email = MimeMessage(session)
                email.setFrom(InternetAddress("me"))
                email.addRecipient(jakarta.mail.Message.RecipientType.TO, InternetAddress(destinationEmail))
                email.subject = subject

                // Create the message part
                val mimeBodyPart = MimeBodyPart()
                mimeBodyPart.setContent(bodyText, "text/plain")

                // Create the attachment part
                val attachmentBodyPart = MimeBodyPart()
                attachmentBodyPart.setFileName(attachmentFileName)
                attachmentBodyPart.setContent(attachmentData, "application/octet-stream")

                // Create a multipart message
                val multipart = MimeMultipart()
                multipart.addBodyPart(mimeBodyPart)
                multipart.addBodyPart(attachmentBodyPart)

                // Set the complete message parts
                email.setContent(multipart)

                // Encode the email in Base64 URL-safe
                val byteArrayOutputStream = java.io.ByteArrayOutputStream()
                email.writeTo(byteArrayOutputStream)
                val rawMessage = Base64.getUrlEncoder().encodeToString(byteArrayOutputStream.toByteArray())

                // Create the Message instance for the Google Mail API
                val message = Message().apply {
                    raw = rawMessage
                }

                // Set headers and body for Google Mail endpoint
                exchange.getIn().setHeader("CamelGoogleMailContent", message)
                exchange.getIn().setHeader("CamelGoogleMailUserId", "me")
                exchange.getIn().body = message
            }
            .to("google-mail:messages/send")
            .log("Email sent to: \${header.to}")
    }
}
