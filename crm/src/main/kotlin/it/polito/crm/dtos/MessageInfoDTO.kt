package it.polito.crm.dtos

import it.polito.crm.utils.Channel
import it.polito.crm.utils.MessageStatus

data class MessageInfoDTO(
    val messageId: Long,
    val sender: String,
    val date: String,
    val subject: String,
    val status: MessageStatus,
    val channel: Channel,
    val priority: Int,
    val hasAttachments: Boolean?
)