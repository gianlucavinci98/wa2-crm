package it.polito.crm.services

import it.polito.crm.dtos.CustomerDTO
import it.polito.crm.entities.Customer
import it.polito.crm.repositories.ContactRepository
import it.polito.crm.repositories.CustomerRepository
import it.polito.crm.utils.*
import org.hibernate.exception.ConstraintViolationException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

@Service
class CustomerServiceImpl(
    private val contactRepository: ContactRepository,
    private val customerRepository: CustomerRepository
) : CustomerService {
    override fun getAllCustomers(pageNumber: Int, pageSize: Int): List<CustomerDTO> {
        return customerRepository.findAll(PageRequest.of(pageNumber, pageSize)).toList().map { it.toDto() }
    }

    override fun getCustomerById(customerId: Long): CustomerDTO {
        return customerRepository.findById(customerId)
            .orElseThrow { CustomerNotFoundException("Customer with $customerId not found") }.toDto()
    }

    override fun insertNewCustomer(contactId: Long): CustomerDTO {
        val contact =
            contactRepository.findById(contactId).orElseThrow { ContactNotFoundException("Contact not found") }

        val newCustomer = Customer()
        try {
            when (contact.category) {
                Category.Professional -> contact.category = Category.CustomerProfessional
                Category.Unknown -> contact.category = Category.Customer
                else -> throw CustomerConflictException("The contact $contactId has already been associated to a customer profile")
            }

            newCustomer.contact = contact

            contactRepository.save(contact)
            return customerRepository.save(newCustomer).toDto()
        } catch (e: CustomerConflictException) {
            throw e
        } catch (e: Exception) {
            throw CustomerProcessingException("Error in creating new customer")
        }
    }

    override fun deleteCustomer(customerId: Long) {
        val customer =
            customerRepository.findById(customerId)
                .orElseThrow { CustomerNotFoundException("Customer with $customerId not found") }

        when (customer.contact.category) {
            Category.Customer -> customer.contact.category = Category.Unknown
            Category.CustomerProfessional -> customer.contact.category = Category.Professional
            else -> customer.contact.category = Category.Unknown
        }

        try {
            customerRepository.delete(customer)
        } catch (e: DataIntegrityViolationException) {
            if (e.cause is ConstraintViolationException) {
                throw CustomerProcessingException("Delete of a customer is only permitted if the customer is not associated with any job offer")
            } else {
                throw e
            }
        } catch (e: Exception) {
            throw CustomerProcessingException("Error occurred while deleting customer with ID $customerId")
        }

        contactRepository.save(customer.contact)
    }

    override fun insertNewNote(customerId: Long, note: String): CustomerDTO {
        val customer =
            customerRepository.findById(customerId)
                .orElseThrow { CustomerNotFoundException("Customer with $customerId not found") }

        customer.notes += note

        return customerRepository.save(customer).toDto()
    }
}