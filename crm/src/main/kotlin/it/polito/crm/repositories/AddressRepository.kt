package it.polito.crm.repositories

import it.polito.crm.entities.Address
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AddressRepository : JpaRepository<Address, Long> {
    fun findByAddress(address: String): Address?
}