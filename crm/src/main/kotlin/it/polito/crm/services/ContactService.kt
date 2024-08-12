package it.polito.crm.services

import it.polito.crm.dtos.*
import it.polito.crm.utils.Category

interface ContactService {
    fun getAllContacts(
        pageNumber: Int, pageSize: Int,
        name: String?,
        surname: String?,
        ssn: String?,
        category: Category?,
        address: String?,
        emailAddress: String?,
        telephoneNumber: String?
    ): List<ContactDTO>?

    fun getContactById(contactId: Long): ContactDetailsDTO?

    fun updateContact(contactId: Long, newContact: ContactDTO): ContactDTO

    fun insertNewContact(contactDTO: ContactDTO): ContactDTO?

    fun deleteContact(contactId: Long)

    fun addAddressToContact(contactId: Long, address: AddressDTO): ContactDetailsDTO?

    fun addEmailToContact(contactId: Long, email: EmailDTO): ContactDetailsDTO?

    fun addTelephoneToContact(contactId: Long, telephone: TelephoneDTO): ContactDetailsDTO?

    fun deleteEmailFromContact(contactId: Long, emailId: Long)

    fun deleteAddressFromContact(contactId: Long, addressId: Long)

    fun deleteTelephoneFromContact(contactId: Long, telephoneId: Long)

    fun updateAddressOfContact(contactId: Long, addressId: Long, address: AddressDTO): ContactDetailsDTO?

    fun updateEmailOfContact(contactId: Long, emailId: Long, email: EmailDTO): ContactDetailsDTO?

    fun updateTelephoneOfContact(contactId: Long, telephoneId: Long, telephone: TelephoneDTO): ContactDetailsDTO?
}