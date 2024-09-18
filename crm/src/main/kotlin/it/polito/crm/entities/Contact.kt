package it.polito.crm.entities

import it.polito.crm.dtos.ContactDTO
import it.polito.crm.dtos.ContactDetailsDTO
import it.polito.crm.utils.Category
import jakarta.persistence.*

@Entity
@Table(name = "contacts")
class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contact_id")
    val contactId: Long = 0

    @Column(name = "name")
    lateinit var name: String

    @Column(name = "surname")
    lateinit var surname: String

    @Column(name = "ssn")
    lateinit var ssn: String

    @ManyToMany(mappedBy = "addressContacts")
    val addresses: MutableSet<Address> = mutableSetOf()

    @ManyToMany(mappedBy = "emailContacts")
    val emails: MutableSet<Email> = mutableSetOf()

    @ManyToMany(mappedBy = "telephoneContacts")
    val telephones: MutableSet<Telephone> = mutableSetOf()

    @Column(name = "category")
    lateinit var category: Category

    fun addAddress(a: Address) {
        addresses.add(a)
        a.addressContacts.add(this)
    }

    fun addEmail(e: Email) {
        emails.add(e)
        e.emailContacts.add(this)
    }

    fun addTelephone(t: Telephone) {
        telephones.add(t)
        t.telephoneContacts.add(this)
    }

    fun toDto(professionalId: Long? = null, customerId: Long? = null): ContactDTO =
        ContactDTO(this.contactId, this.name, this.surname, this.ssn, this.category, professionalId, customerId)

    fun toDetailsDto(professionalId: Long? = null, customerId: Long? = null): ContactDetailsDTO = ContactDetailsDTO(
        this.contactId,
        this.name,
        this.surname,
        this.ssn,
        this.category,
        this.addresses.map { it.toDto() }.toSet(),
        this.emails.map { it.toDto() }.toSet(),
        this.telephones.map { it.toDto() }.toSet(),
        professionalId,
        customerId
    )
}