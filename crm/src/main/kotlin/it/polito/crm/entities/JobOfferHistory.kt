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
    @Column(name = "job_offer_history_id", nullable = false)
    val jobOfferHistoryId: Long = 0

    @ManyToOne
    var jobOffer: JobOffer? = null

    @Column(name = "date")
    var date: LocalDateTime = LocalDateTime.now()

    @Column(name = "status")
    lateinit var jobOfferStatus: JobOfferStatus

    @OneToMany(mappedBy = "jobOfferHistory", cascade = [CascadeType.ALL], orphanRemoval = true)
    var candidates = mutableSetOf<Application>()

    @Column(name = "note")
    var note: String? = null

    fun addJobApplication(professional: Professional, status: ApplicationStatus = ApplicationStatus.Pending) {
        val application = Application()

        application.professional = professional
        application.jobOfferHistory = this
        application.status = status

        candidates.add(application)
        professional.jobApplications.add(application)
    }

    fun removeJobApplication(application: Application) {
        candidates.remove(application)
        application.professional.jobApplications.remove(application)
    }

    fun toDto(): JobOfferHistoryDTO =
        JobOfferHistoryDTO(
            this.jobOfferHistoryId,
            this.jobOfferStatus,
            this.date,
            this.candidates.map { it.toDto() }.toMutableSet(),
            this.note
        )
}