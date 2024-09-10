package it.polito.analytics.services

import it.polito.analytics.dtos.JobOfferSkillsStatisticDTO
import it.polito.analytics.dtos.JobOfferTimeStatisticDTO

interface JobOfferStatisticService {
    fun getElapsedStatusTime(): JobOfferTimeStatisticDTO
    fun getSkillsCount(): JobOfferSkillsStatisticDTO
}