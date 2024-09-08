package it.polito.analytics.repositories

import it.polito.analytics.documents.JobOffer
import it.polito.analytics.documents.JobOfferSkill
import org.springframework.data.mongodb.repository.Aggregation
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.math.BigInteger

@Repository
interface JobOfferSkillsRepository : MongoRepository<JobOfferSkill, BigInteger>{

    @Aggregation(pipeline = [
        "{ '\$unwind': '\$skills' }",
        "{ '\$group': { _id: '\$skills', count: { '\$sum': 1 } } }",
        "{ '\$sort': { count: -1 } }"
    ])
    fun getSkillsCount(): List<SkillCount>

    data class SkillCount(
        val _id: String,
        val count: Long
    )
}
