package it.polito.analytics.documents

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.math.BigInteger
import java.time.LocalDateTime

enum class JobOfferStatus {
    Created, SelectionPhase, CandidateProposal, Consolidated, Done, Aborted
}

@Document
data class JobOffer(
    @Id val jobOfferId: BigInteger,
    val skills: MutableSet<String>,
    val jobOfferHistory: MutableList<Pair<JobOfferStatus, LocalDateTime>>
)
