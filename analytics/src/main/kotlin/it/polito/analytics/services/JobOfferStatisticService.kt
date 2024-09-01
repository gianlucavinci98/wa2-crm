package it.polito.analytics.services

import it.polito.analytics.dtos.JobOfferSkillsStatisticDTO
import it.polito.analytics.dtos.JobOfferTimeStatisticDTO

interface JobOfferStatisticService {
    fun getAverageStatusTime(): JobOfferTimeStatisticDTO
    fun getSkillsCount(): JobOfferSkillsStatisticDTO
}