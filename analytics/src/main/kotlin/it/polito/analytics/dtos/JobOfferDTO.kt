package it.polito.analytics.dtos

import it.polito.analytics.documents.JobOfferStatus

data class JobOfferDTO(
    val job_offer_id: Long,
    val customer_customer_id: Long,
    val description: String?,
    val details: String?,
    val status: JobOfferStatus?,
    val duration: Long,
    val value: Float?,
    val selected_professional_professional_id: Long?
)
