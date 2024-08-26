package it.polito.crm.entities

import it.polito.crm.dtos.ApplicationDTO
import jakarta.persistence.*
import java.io.Serializable
import java.time.LocalDateTime

enum class ApplicationStatus {
    Pending, Accepted, Aborted
}

class ApplicationId(
    var professional: Long = 0,
    var jobOfferHistory: Long = 0
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || javaClass != other.javaClass) return false

        other as ApplicationId

        if (jobOfferHistory != other.jobOfferHistory) return false
        if (professional != other.professional) return false

        return true
    }

    override fun hashCode(): Int {
        var result = jobOfferHistory.hashCode()
        result = 31 * result + professional.hashCode()
        return result
    }
}

@Entity
@Table(name = "applications")
@IdClass(ApplicationId::class)
class Application {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_id", referencedColumnName = "professional_id")
    lateinit var professional: Professional

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_offer_history_id", referencedColumnName = "job_offer_history_id")
    lateinit var jobOfferHistory: JobOfferHistory

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    var status: ApplicationStatus = ApplicationStatus.Pending

    @Column(name = "date")
    val date: LocalDateTime = LocalDateTime.now()

    fun toDto(): ApplicationDTO {
        return ApplicationDTO(
            this.professional.professionalId,
            this.jobOfferHistory.jobOfferHistoryId,
            this.status,
            this.date
        )
    }
}