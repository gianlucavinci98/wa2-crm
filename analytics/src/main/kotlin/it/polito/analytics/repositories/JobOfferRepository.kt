package it.polito.analytics.repositories

import it.polito.analytics.documents.JobOffer
import it.polito.analytics.documents.JobOfferStatus
import org.springframework.data.mongodb.repository.Aggregation
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.math.BigInteger

@Repository
interface JobOfferRepository : MongoRepository<JobOffer, BigInteger> {
    @Aggregation(
        pipeline = [
            "{ '\$unwind': '\$jobOfferHistory' }",
            "{ '\$sort': { '_id': 1, 'jobOfferHistory.second.date': 1 } }",
            "{ '\$group': { '_id': '\$_id', 'jobHistory': { '\$push': { 'status': '\$jobOfferHistory.first', 'date': '\$jobOfferHistory.second' } } } }",
            "{ '\$project': { '_id': 1, 'statistics': { '\$map': { 'input': { '\$range': [ 1, { '\$size': '\$jobHistory' } ] }, 'as': 'index', 'in': { 'currentStatus': { '\$arrayElemAt': [ '\$jobHistory.status', '\$\$index' ] }, 'previousStatus': { '\$arrayElemAt': [ '\$jobHistory.status', { '\$subtract': [ '\$\$index', 1 ] } ] }, 'timeElapsed': { '\$dateDiff': { 'startDate': { '\$toDate': { '\$arrayElemAt': [ '\$jobHistory.date', { '\$subtract': [ '\$\$index', 1 ] } ] } }, 'endDate': { '\$toDate': { '\$arrayElemAt': [ '\$jobHistory.date', '\$\$index' ] } }, 'unit': 'millisecond' } } } } } } }",
            "{ '\$unwind': '\$statistics' }",
            "{ '\$project': { '_id': 1, 'status': '\$statistics.previousStatus', 'timeElapsed': '\$statistics.timeElapsed' } }",
            "{ '\$group': { '_id': { 'id': '\$_id', 'status': '\$status' }, 'totalTimeElapsed': { '\$sum': '\$timeElapsed' }, 'count': { '\$sum': 1 } } }",
            "{ '\$project': { '_id': '\$_id.id', 'status': '\$_id.status', 'timeElapsed': '\$totalTimeElapsed', 'count': '\$count' } }",
            "{ '\$group': { '_id': '\$_id', 'jobOfferHistory': { '\$push': { 'status': '\$status', 'timeElapsed': '\$timeElapsed', 'count': '\$count' } } } }",
            "{ '\$sort': { '_id': 1 } }"
        ]
    )
    fun getElapsedStatusTime(): List<TimeStatistic>
}

data class TimeStatistic(
    val id: Long,
    val jobOfferHistory: List<TimeCount>
)

data class TimeCount(
    val status: JobOfferStatus,
    val timeElapsed: Long,
    val count: Long
)