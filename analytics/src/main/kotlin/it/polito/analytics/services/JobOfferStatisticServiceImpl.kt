package it.polito.analytics.services

import it.polito.analytics.dtos.JobOfferSkillsStatisticDTO
import it.polito.analytics.dtos.JobOfferTimeStatisticDTO
import it.polito.analytics.repositories.JobOfferSkillsRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.aggregation.AggregationResults
import org.springframework.stereotype.Service
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.aggregation.Aggregation

@Service
class JobOfferStatisticServiceImpl(private val jobOfferSkillsRepository: JobOfferSkillsRepository) :
    JobOfferStatisticService {
    override fun getAverageStatusTime(): JobOfferTimeStatisticDTO {
        TODO("Not yet implemented")
    }

    override fun getSkillsCount(): JobOfferSkillsStatisticDTO {
        val skillCount = jobOfferSkillsRepository.getSkillsCount()
        val count = jobOfferSkillsRepository.count()

        val jobOfferSkillStatisticDTO = JobOfferSkillsStatisticDTO(count, skillCount.map { it._id to it.count }.toMap())

        return jobOfferSkillStatisticDTO
    }
}
