package it.polito.crm.dtos

import it.polito.crm.utils.Channel
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

data class MessageDTO(
    @field:Min(
        value = 0, message = "Invalid messageId, it must be equal or greater than 0"
    )
    val messageId: Long?,
    @field:NotBlank(message = "Invalid sender, it must not be blank")
    val sender: String,
    val date: String?,
    val subject: String?,
    val body: String?,
    val channel: Channel,
    val priority: Int?
)