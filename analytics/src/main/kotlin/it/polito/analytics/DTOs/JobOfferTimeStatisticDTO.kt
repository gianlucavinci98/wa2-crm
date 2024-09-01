package it.polito.analytics.dtos

import it.polito.analytics.documents.JobOfferStatus

data class JobOfferTimeStatisticDTO (
    val totalJobOffer: Long,
    /**
     * Is a map where the Key is `JobOfferStatus` and
     * Value is a `Triple` containing three `Long` values
     * corresponding to:
     * - total time in status X
     * - total time that a JobOffer was in status X
     * - average time spent for each status X
     * */
    val statusAvg: Map<JobOfferStatus, Triple<Long, Long, Long>>
)
