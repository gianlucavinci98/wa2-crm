package it.polito.analytics.dtos

import it.polito.analytics.repositories.TimeStatistic

data class JobOfferTimeStatisticDTO (
    val totalJobOffer: Long,
    val timeStatistic: List<TimeStatistic>
)
