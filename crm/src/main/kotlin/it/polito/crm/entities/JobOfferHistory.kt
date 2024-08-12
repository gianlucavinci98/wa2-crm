package it.polito.crm.entities

import it.polito.crm.dtos.JobOfferHistoryDTO
import it.polito.crm.utils.JobOfferStatus
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "job_offers_history")
class JobOfferHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val jobOfferHistoryId: Long = 0

    @ManyToOne
    var jobOffer: JobOffer? = null

    @Column(name = "date")
    var date: LocalDateTime = LocalDateTime.now()

    @Column(name = "status")
    lateinit var jobOfferStatus: JobOfferStatus

    @Column(name = "note")
    lateinit var note: String

    fun toDto(): JobOfferHistoryDTO =
        JobOfferHistoryDTO(this.jobOfferHistoryId, this.jobOfferStatus, this.date, this.note)
}