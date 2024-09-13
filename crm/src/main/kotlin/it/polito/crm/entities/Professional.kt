package it.polito.crm.entities

import it.polito.crm.dtos.ProfessionalDTO
import it.polito.crm.utils.EmploymentState
import jakarta.persistence.*

@Entity
@Table(name = "professionals")
class Professional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "professional_id", nullable = false)
    val professionalId: Long = 0

    @ElementCollection
    var skills = mutableSetOf<String>()

    @Column(name = "employment_state")
    var employmentState = EmploymentState.Unemployed

    @Column(name = "daily_rate")
    var dailyRate: Float = 0.0f

    @Column(name = "location")
    lateinit var location: String

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", referencedColumnName = "contact_id")
    lateinit var contact: Contact

    @OneToMany(mappedBy = "professional", cascade = [CascadeType.ALL], orphanRemoval = true)
    val jobApplications = mutableSetOf<Application>()

    fun addJobApplication(jobOfferHistory: JobOfferHistory, status: ApplicationStatus = ApplicationStatus.Pending) {
        val application = Application()

        application.professional = this
        application.jobOfferHistory = jobOfferHistory
        application.status = status

        jobApplications.add(application)
        jobOfferHistory.candidates.add(application)
    }

    fun removeJobApplication(application: Application) {
        jobApplications.remove(application)
        application.jobOfferHistory.candidates.remove(application)
    }

    fun toDto(): ProfessionalDTO = ProfessionalDTO(
        this.professionalId,
        this.skills,
        this.employmentState,
        this.dailyRate,
        this.location,
        this.contact.toDto(),
        this.jobApplications.map { it.toDto() }.toMutableSet()
    )
}