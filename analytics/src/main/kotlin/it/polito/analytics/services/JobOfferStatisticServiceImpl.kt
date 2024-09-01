package it.polito.analytics.services

import it.polito.analytics.dtos.JobOfferSkillsStatisticDTO
import it.polito.analytics.dtos.JobOfferTimeStatisticDTO
import it.polito.analytics.repositories.JobOfferRepository
import org.springframework.stereotype.Service

@Service
class JobOfferStatisticServiceImpl(private val jobOfferRepository: JobOfferRepository) : JobOfferStatisticService {
    override fun getAverageStatusTime(): JobOfferTimeStatisticDTO {
        TODO("Not yet implemented")
    }

    override fun getSkillsCount(): JobOfferSkillsStatisticDTO {
        TODO("Not yet implemented")
    }
}
