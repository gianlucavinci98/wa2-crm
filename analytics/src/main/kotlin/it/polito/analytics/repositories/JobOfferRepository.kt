package it.polito.analytics.repositories

import it.polito.analytics.documents.JobOffer
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.math.BigInteger

@Repository
interface JobOfferRepository : MongoRepository<JobOffer, BigInteger>