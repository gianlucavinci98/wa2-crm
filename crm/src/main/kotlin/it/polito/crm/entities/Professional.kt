package it.polito.crm.entities

import it.polito.crm.dtos.ProfessionalDTO
import it.polito.crm.utils.EmploymentState
import jakarta.persistence.*

@Entity
@Table(name = "professionals")
class Professional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "professional_id")
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

    @OneToMany(mappedBy = "professional")
    val jobOffers = mutableSetOf<JobOffer>()

    fun addJobOffer(jobOffer: JobOffer) {
        jobOffer.professional = this
        this.jobOffers.add(jobOffer)
    }

    fun removeJobOffer(jobOffer: JobOffer) {
        jobOffer.professional = null
        this.jobOffers.remove(jobOffer)
    }

    fun toDto(): ProfessionalDTO = ProfessionalDTO(
        this.professionalId,
        this.skills,
        this.employmentState,
        this.dailyRate,
        this.location,
        this.contact
    )
}