package it.polito.crm.entities

import it.polito.crm.dtos.TelephoneDTO
import jakarta.persistence.*

@Entity
@Table(name = "telephones")
class Telephone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val telephoneId: Long = 0

    @Column(name = "telephone_number")
    lateinit var telephoneNumber: String

    @ManyToMany
    @JoinTable(
        name = "telephone_contact_bridge",
        joinColumns = [JoinColumn(name = "telephone_id")],
        inverseJoinColumns = [JoinColumn(name = "contact_id")]
    )
    val telephoneContacts: MutableSet<Contact> = mutableSetOf()

    fun addTelephoneContact(c: Contact) {
        telephoneContacts.add(c)
        c.telephones.add(this)
    }

    fun removeContact(c: Contact) {
        telephoneContacts.remove(c)
        c.telephones.remove(this)
    }

    fun toDto(): TelephoneDTO = TelephoneDTO(this.telephoneId, this.telephoneNumber)
}