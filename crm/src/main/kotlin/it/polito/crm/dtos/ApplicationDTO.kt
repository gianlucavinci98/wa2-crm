package it.polito.crm.dtos

import it.polito.crm.entities.ApplicationStatus
import java.time.LocalDateTime

data class ApplicationDTO(
    val professionalId: Long,
    val jobOfferHistoryId: Long,
    val status: ApplicationStatus,
    val date: LocalDateTime
)