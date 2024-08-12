package it.polito.communication_manager.controllers

import it.polito.communication_manager.dto.MessageSentDTO
import it.polito.communication_manager.dto.MessageSentWithAttachmentDTO
import jakarta.validation.constraints.NotBlank
import org.apache.camel.ProducerTemplate
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.regex.Pattern

@RestController
@RequestMapping("/api/emails")
class MessageController(private val producerTemplate: ProducerTemplate) {
    private val logger = LoggerFactory.getLogger(MessageController::class.java)

    @PostMapping("", "/")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun sendMessage(
        @NotBlank @RequestPart("destinationEmail", required = true) destinationEmail: String,
        @NotBlank @RequestPart("subject", required = true) subject: String,
        @NotBlank @RequestPart("body", required = true) body: String,
        @RequestPart("attachmentData") attachmentData: MultipartFile?
    ): ResponseEntity<Any> {
        if (!isValidEmail(destinationEmail)) {
            return ResponseEntity("Invalid email address : $destinationEmail", HttpStatus.BAD_REQUEST)
        }

        val emailHeaders: Map<String, Any?> = if (attachmentData != null) {
            val attachmentBytes = attachmentData.bytes
            val attachmentFileName = attachmentData.originalFilename
            mapOf(
                "to" to destinationEmail,
                "subject" to subject,
                "attachmentFileName" to attachmentFileName,
                "attachmentData" to attachmentBytes,
                "CamelGoogleMailContent" to body,
                "CamelGoogleMailUserId" to "me"
            )
        } else {
            mapOf(
                "to" to destinationEmail,
                "subject" to subject
            )
        }
        logger.info("Starting sending e-mail message to: $destinationEmail")

        producerTemplate.sendBodyAndHeaders(
            if (attachmentData != null) "direct:sendEmailWithAttachment" else "direct:sendEmail",
            body,
            emailHeaders
        )

        if (attachmentData != null) {
            return ResponseEntity(
                MessageSentWithAttachmentDTO(
                    destinationEmail,
                    subject,
                    body,
                    attachmentData.originalFilename
                ), HttpStatus.OK
            )
        }
        return ResponseEntity(MessageSentDTO(destinationEmail, subject, body), HttpStatus.OK)
    }

    private fun isValidEmail(email: String): Boolean {
        val emailRegex = "^(([a-z]|[0-9])+(\\.)?)+@([a-z]|[0-9])+\\.[a-z]+$"
        val pattern = Pattern.compile(emailRegex)
        return pattern.matcher(email).matches()
    }
}