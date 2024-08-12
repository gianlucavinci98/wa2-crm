package it.polito.crm.dtos

import it.polito.crm.utils.Channel

data class MessageInfoDTO(
    val messageId: Long,
    val sender: String,
    val date: String,
    val subject: String,
    val channel: Channel,
    val priority: Int
)