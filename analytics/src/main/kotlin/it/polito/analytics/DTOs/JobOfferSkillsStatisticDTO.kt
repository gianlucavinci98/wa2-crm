package it.polito.analytics.dtos

data class JobOfferSkillsStatisticDTO(
    val totalJobOffer: Long,
    val skillCount: Map<String, Long>
)
