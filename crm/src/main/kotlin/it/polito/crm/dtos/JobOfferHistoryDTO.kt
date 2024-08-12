package it.polito.crm.dtos

import it.polito.crm.utils.JobOfferStatus
import jakarta.validation.constraints.Min
import java.time.LocalDateTime

data class JobOfferHistoryDTO(
    @field:Min(
        value = 0, message = "Invalid jobOfferHistoryId, it must be equal or greater than 0"
    )
    val jobOfferHistoryId: Long,
    val jobOfferStatus: JobOfferStatus,
    val date: LocalDateTime?,
    val note: String?
)