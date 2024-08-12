package it.polito.communication_manager.dto

enum class Channel {
    Address, Email, Telephone
}

data class MessageDTO(
    val messageId: Long?,
    val sender: String,
    val date: String?,
    val subject: String?,
    val body: String?,
    val channel: Channel,
    val priority: Int?
)