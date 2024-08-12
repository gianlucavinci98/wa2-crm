package it.polito.communication_manager.dto

data class MessageSentDTO(
    val destinationEmail: String,
    val subject: String,
    val body: String
)

data class MessageSentWithAttachmentDTO(
    val destinationEmail: String,
    val subject: String,
    val body: String,
    val attachmentName: String?
)