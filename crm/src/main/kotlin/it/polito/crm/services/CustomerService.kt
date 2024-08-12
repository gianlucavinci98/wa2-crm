package it.polito.crm.services

import it.polito.crm.dtos.CustomerDTO

interface CustomerService {
    fun getAllCustomers(pageNumber: Int, pageSize: Int): List<CustomerDTO>
    fun getCustomerById(customerId: Long): CustomerDTO
    fun insertNewCustomer(contactId: Long): CustomerDTO
    fun deleteCustomer(customerId: Long)
    fun insertNewNote(customerId: Long, note: String): CustomerDTO
}