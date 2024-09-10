package it.polito.analytics.services

import it.polito.analytics.dtos.JobOfferSkillsStatisticDTO
import it.polito.analytics.dtos.JobOfferTimeStatisticDTO
import it.polito.analytics.repositories.JobOfferRepository
import it.polito.analytics.repositories.JobOfferSkillsRepository
import org.springframework.stereotype.Service

@Service
class JobOfferStatisticServiceImpl(
    private val jobOfferRepository: JobOfferRepository,
    private val jobOfferSkillsRepository: JobOfferSkillsRepository
) :
    JobOfferStatisticService {
    override fun getElapsedStatusTime(): JobOfferTimeStatisticDTO {
        val count = jobOfferRepository.count()
        val timeStatistic = jobOfferRepository.getElapsedStatusTime()

        val jobOfferTimeStatisticDTO = JobOfferTimeStatisticDTO(count, timeStatistic)

        return jobOfferTimeStatisticDTO
    }

    override fun getSkillsCount(): JobOfferSkillsStatisticDTO {
        val count = jobOfferSkillsRepository.count()
        val res = jobOfferSkillsRepository.getSkillsCount()

        val jobOfferSkillStatisticDTO = JobOfferSkillsStatisticDTO(count, res.associate { it._id to it.count })

        return jobOfferSkillStatisticDTO
    }
}
