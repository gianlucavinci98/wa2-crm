package it.polito.crm.entities

import it.polito.crm.dtos.AddressDTO
import jakarta.persistence.*

@Entity
@Table(name = "addresses")
class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    val addressId: Long = 0

    @Column(name = "address")
    lateinit var address: String

    @ManyToMany
    @JoinTable(
        name = "address_contact_bridge",
        joinColumns = [JoinColumn(name = "address_id")],
        inverseJoinColumns = [JoinColumn(name = "contact_id")]
    )
    val addressContacts: MutableSet<Contact> = mutableSetOf()

    fun addContact(c: Contact) {
        addressContacts.add(c)
        c.addresses.add(this)
    }

    fun removeContact(c: Contact) {
        addressContacts.remove(c)
        c.addresses.remove(this)
    }

    fun toDto(): AddressDTO = AddressDTO(this.addressId, this.address)
}