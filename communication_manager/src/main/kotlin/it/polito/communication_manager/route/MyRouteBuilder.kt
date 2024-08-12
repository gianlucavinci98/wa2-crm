package it.polito.communication_manager.route

import com.google.api.services.gmail.model.Message
import it.polito.communication_manager.dto.Channel
import it.polito.communication_manager.dto.MessageDTO
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

                // this operation takes out this value: Leonardo Moracci <moracci99@gmail.com> by we want only the email
                val from =
                    message.payload.headers.find { e -> e.name.equals("from", true) }?.get("value")?.toString() ?: ""
                val email = from.substringAfter("<").substringBefore(">")

                val date =
                    Instant.ofEpochMilli(it.getIn().messageTimestamp).atZone(ZoneId.systemDefault()).toLocalDateTime()
                        .toString()

                val rawMessage = ep.client.users().messages().get("me", id).setFormat("raw").execute()
                val body = rawMessage.raw

                val messageDTO = MessageDTO(null, email, date, subject, body, Channel.Email, 0)

                it.getIn().body = messageDTO
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
