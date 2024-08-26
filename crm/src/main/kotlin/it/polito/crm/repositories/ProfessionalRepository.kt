package it.polito.crm.repositories

import it.polito.crm.entities.Contact
import it.polito.crm.entities.Professional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface ProfessionalRepository : JpaRepository<Professional, Long>{
    fun findByContact(contact: Contact): Optional<Professional>
}