package it.polito.crm.controllers

import it.polito.crm.dtos.CustomerDTO
import it.polito.crm.services.CustomerServiceImpl
import jakarta.validation.constraints.Min
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/customers")
class CustomerController(private val customerServiceImpl: CustomerServiceImpl) {
    @GetMapping("", "/")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    fun getAllCustomers(
        @RequestParam("pageNumber", required = false) @Min(
            value = 0,
            message = "Page number not valid, value must be great or equal to 0"
        ) pageNumber: Int = 0,
        @RequestParam("pageSize", required = false) @Min(
            value = 1,
            message = "Page size not valid, value must be great or equal to 1"
        ) pageSize: Int = 20
    ): List<CustomerDTO> {
        return customerServiceImpl.getAllCustomers(pageNumber, pageSize)
    }

    @GetMapping("/{customerId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    fun getCustomerById(@PathVariable("customerId", required = true) customerId: Long): CustomerDTO {
        return customerServiceImpl.getCustomerById(customerId)
    }

    @PostMapping("/{contactId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    @ResponseStatus(HttpStatus.CREATED)
    fun insertNewCustomer(@PathVariable("contactId", required = true) contactId: Long): CustomerDTO {
        return customerServiceImpl.insertNewCustomer(contactId)
    }

    @DeleteMapping("/{customerId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteCustomerById(@PathVariable("customerId", required = true) customerId: Long) {
        customerServiceImpl.deleteCustomer(customerId)
    }

    @PostMapping("/{customerId}/notes")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    @ResponseStatus(HttpStatus.CREATED)
    fun insertNewNote(
        @PathVariable("customerId", required = true) customerId: Long,
        @RequestBody note: String
    ): CustomerDTO {
        return customerServiceImpl.insertNewNote(customerId, note)
    }
}