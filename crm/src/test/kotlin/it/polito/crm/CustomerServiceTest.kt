package it.polito.crm

import it.polito.crm.services.ContactService
import it.polito.crm.services.CustomerService
import it.polito.crm.utils.Category
import it.polito.crm.utils.ContactNotFoundException
import it.polito.crm.utils.CustomerConflictException
import it.polito.crm.utils.CustomerNotFoundException
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.transaction.annotation.Transactional

class CustomerServiceTest : IntegrationTest() {
    @Autowired
    private lateinit var customerService: CustomerService

    @Autowired
    private lateinit var contactService: ContactService

    @Test
    @Transactional
    @Sql("/sql/customer/testCustomer.sql")
    @Rollback
    fun insertNewCustomerTest() {
        val result = customerService.insertNewCustomer(100)

        assertNotNull(result)
    }

    @Test
    @Sql("/sql/customer/testCustomer.sql")
    @jakarta.transaction.Transactional
    @Rollback
    fun `insert new customer to a contact that is linked already to a professional profile`() {
        customerService.insertNewCustomer(104)

        val contact = contactService.getContactById(104)!!

        assertEquals(contact.category, Category.CustomerProfessional)
    }

    @Test
    @Transactional
    @Sql("/sql/customer/testCustomer.sql")
    @Rollback
    fun insertNewCustomerContactNotFoundTest() {
        assertThrows<ContactNotFoundException> { customerService.insertNewCustomer(1000) }
    }

    @Test
    @Transactional
    @Sql("/sql/customer/testCustomer.sql")
    @Rollback
    fun insertNewCustomerConflictTest() {
        customerService.insertNewCustomer(100)
        assertThrows<CustomerConflictException> { customerService.insertNewCustomer(100) }
    }

    @Test
    @Transactional
    @Sql("/sql/customer/testCustomer.sql")
    @Rollback
    fun getCustomerByIdTest() {
        val customer = customerService.insertNewCustomer(100)
        val result = customerService.getCustomerById(customer.customerId!!)

        assertNotNull(result)
        assertEquals(customer.customerId!!, result.customerId)
    }

    @Test
    @Transactional
    @Sql("/sql/customer/testCustomer.sql")
    @Rollback
    fun getCustomerByIdNotFoundTest() {
        assertThrows<CustomerNotFoundException> { customerService.getCustomerById(1000) }
    }

    @Test
    @Transactional
    @Sql("/sql/customer/testCustomer.sql")
    @Rollback
    fun insertNewNoteTest() {
        val note = "New note"
        val result = customerService.insertNewNote(103, note)

        assertNotNull(result)
        assertTrue(result.notes?.contains(note) ?: false)
    }

    @Test
    @Transactional
    @Sql("/sql/customer/testCustomer.sql")
    @Rollback
    fun deleteCustomerTest() {
        assertDoesNotThrow { customerService.deleteCustomer(103) }

        assertThrows<CustomerNotFoundException> {
            customerService.getCustomerById(103)
        }
    }

    @Test
    @Transactional
    @Sql("/sql/customer/testCustomer.sql")
    @Rollback
    fun deleteCustomerButNotAssociatedContactTest() {
        val customer = customerService.getCustomerById(103)

        assertDoesNotThrow { customerService.deleteCustomer(103) }

        assertDoesNotThrow { contactService.getContactById(customer.contact?.contactId!!) }

        val contact = contactService.getContactById(customer.contact?.contactId!!)!!

        assertEquals(contact.category, Category.Unknown)
    }
}