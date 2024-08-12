package it.polito.crm.repositories

import it.polito.crm.entities.Customer
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface CustomerRepository  : JpaRepository<Customer, Long> {
    fun findCustomerByCustomerId(customerId: Long): Optional<Customer>
}