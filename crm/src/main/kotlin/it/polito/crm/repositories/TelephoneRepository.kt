package it.polito.crm.repositories

import it.polito.crm.entities.Telephone
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TelephoneRepository : JpaRepository<Telephone, Long> {
    fun findByTelephoneNumber(telephone: String): Telephone?
}