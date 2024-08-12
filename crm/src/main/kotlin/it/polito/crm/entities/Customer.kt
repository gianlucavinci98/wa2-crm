package it.polito.crm.entities

import it.polito.crm.dtos.CustomerDTO
import jakarta.persistence.*

@Entity
@Table(name = "customers")
class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    val customerId: Long = 0

    @ElementCollection
    val notes: MutableSet<String> = mutableSetOf()

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", referencedColumnName = "contact_id")
    lateinit var contact: Contact

    @OneToMany(mappedBy = "customer")
    val jobOffers = mutableSetOf<JobOffer>()

    fun addJobOffer(jobOffer: JobOffer) {
        jobOffer.customer = this
        this.jobOffers.add(jobOffer)
    }

    fun removeJobOffer(jobOffer: JobOffer) {
        jobOffer.customer = null
        this.jobOffers.remove(jobOffer)
    }

    fun toDto(): CustomerDTO = CustomerDTO(this.customerId, this.notes, this.contact)
}