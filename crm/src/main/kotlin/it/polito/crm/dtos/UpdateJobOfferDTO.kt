package it.polito.crm.dtos

import it.polito.crm.utils.JobOfferStatus

class UpdateJobOfferDTO(
    val status: JobOfferStatus,
    val notes: String?,
    val professionalId: Long?
)
