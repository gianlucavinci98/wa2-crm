package it.polito.crm.repositories

import it.polito.crm.entities.Address
import it.polito.crm.entities.Contact
import it.polito.crm.entities.Email
import it.polito.crm.entities.Telephone
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface ContactRepository : JpaRepository<Contact, Long> {
    fun findByContactIdAndAddresses(contactId: Long, addresses: MutableSet<Address>): Optional<Contact>
    fun findDistinctByAddresses(addresses: MutableSet<Address>): List<Contact>

    fun findByContactIdAndEmails(contactId: Long, emails: MutableSet<Email>): Optional<Contact>
    fun findDistinctByEmails(emails: MutableSet<Email>): List<Contact>

    fun findByContactIdAndTelephones(contactId: Long, telephones: MutableSet<Telephone>): Optional<Contact>
    fun findDistinctByTelephones(telephones: MutableSet<Telephone>): List<Contact>
}