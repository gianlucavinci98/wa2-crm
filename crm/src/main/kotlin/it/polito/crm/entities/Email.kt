package it.polito.crm.entities

import it.polito.crm.dtos.EmailDTO
import jakarta.persistence.*

@Entity
@Table(name = "emails")
class Email {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val emailId: Long = 0

    @Column(name = "email_address")
    lateinit var emailAddress: String

    @ManyToMany
    @JoinTable(
        name = "email_contact_bridge",
        joinColumns = [JoinColumn(name = "email_id")],
        inverseJoinColumns = [JoinColumn(name = "contact_id")]
    )
    val emailContacts: MutableSet<Contact> = mutableSetOf()

    fun addEmailContact(c: Contact) {
        emailContacts.add(c)
        c.emails.add(this)
    }

    fun removeContact(c: Contact) {
        emailContacts.remove(c)
        c.emails.remove(this)
    }

    fun toDto(): EmailDTO = EmailDTO(this.emailId, this.emailAddress)
}