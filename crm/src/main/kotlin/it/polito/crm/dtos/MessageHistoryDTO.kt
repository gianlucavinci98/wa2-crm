package it.polito.crm.dtos

import it.polito.crm.utils.MessageStatus
import jakarta.validation.constraints.Min
import java.time.LocalDateTime

data class MessageHistoryDTO(
    @field:Min(
        value = 0, message = "Invalid messageHistoryId, it must be equal or greater than 0"
    )
    val messageHistoryId: Long?,
    val messageStatus: MessageStatus,
    val date: LocalDateTime?,
    val comment: String?
)