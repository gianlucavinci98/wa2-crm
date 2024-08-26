package it.polito.crm.entities

import it.polito.crm.dtos.JobOfferDTO
import it.polito.crm.utils.JobOfferStatus
import jakarta.persistence.*

const val profitMargin: Float = 1.08f

@Entity
@Table(name = "job_offers")
class JobOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_offer_id")
    val jobOfferId: Long = 0

    @ManyToOne
    var customer: Customer? = null

    @OneToOne
    var selectedProfessional: Professional? = null

    @Column(name = "description")
    lateinit var description: String

    @Column(name = "status")
    var status: JobOfferStatus = JobOfferStatus.Created

    @OneToMany(mappedBy = "jobOffer", cascade = [(CascadeType.ALL)])
    val jobHistory = mutableSetOf<JobOfferHistory>()

    @Column(name = "duration")
    var duration: Long = 0

    /* The value is calculated as: (professional's rate * duration * profitMargin) */
    /* The professional obtains the professional rate itself(?) */
    @Column(name = "value")
    var value: Float = 0.0f

    @ElementCollection
    var requiredSkills: MutableSet<String> = mutableSetOf()

    /* The details are added ONLY by the OPERATORS after an interview with the CUSTOMER */
    @Column(name = "details")
    var details: String = ""

    fun addCustomer(customer: Customer) {
        customer.jobOffers.add(this)
        this.customer = customer
    }

    fun addHistory(history: JobOfferHistory) {
        history.jobOffer = this
        this.jobHistory.add(history)
    }

    fun toDto(): JobOfferDTO = JobOfferDTO(
        this.jobOfferId,
        this.description,
        this.details,
        this.status,
        this.requiredSkills,
        this.duration,
        this.value,
        this.selectedProfessional?.professionalId
    )
}