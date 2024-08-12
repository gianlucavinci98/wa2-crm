package it.polito.crm.repositories

import it.polito.crm.entities.Email
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EmailRepository : JpaRepository<Email, Long> {
    fun findByEmailAddress(email: String): Email?
}