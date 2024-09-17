package it.polito.crm.services

import it.polito.crm.dtos.*
import it.polito.crm.entities.Address
import it.polito.crm.entities.Contact
import it.polito.crm.entities.Email
import it.polito.crm.entities.Telephone
import it.polito.crm.repositories.*
import it.polito.crm.utils.*
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.*
import org.hibernate.exception.ConstraintViolationException
import org.hibernate.type.descriptor.jdbc.SmallIntJdbcType
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.jvm.optionals.getOrElse

@Service
class ContactServiceImpl(
    private val contactRepository: ContactRepository,
    private val addressRepository: AddressRepository,
    private val emailRepository: EmailRepository,
    private val telephoneRepository: TelephoneRepository,
    private val entityManager: EntityManager,
    private val customerRepository: CustomerRepository,
    private val professionalRepository: ProfessionalRepository
) : ContactService {
    private val logger = LoggerFactory.getLogger(ContactServiceImpl::class.java)

    override fun getAllContacts(
        pageNumber: Int,
        pageSize: Int,
        name: String?,
        surname: String?,
        ssn: String?,
        category: Category?,
        address: String?,
        emailAddress: String?,
        telephoneNumber: String?
    ): List<ContactDTO>? {
        val cb: CriteriaBuilder = entityManager.criteriaBuilder

        val cqContact: CriteriaQuery<Contact> = cb.createQuery(Contact::class.java)
        val rootContact: Root<Contact> = cqContact.from(Contact::class.java)

        val predicates = mutableListOf<Predicate>()

        if (!name.isNullOrBlank()) {
            predicates.add(cb.equal(rootContact.get<String>("name"), name))
        }
        if (!surname.isNullOrBlank()) {
            predicates.add(cb.equal(rootContact.get<String>("surname"), surname))
        }
        if (!ssn.isNullOrBlank()) {
            predicates.add(cb.equal(rootContact.get<String>("ssn"), ssn))
        }
        if (category != null) {
            val categoryPredicates = when (category) {
                Category.Customer -> listOf(
                    cb.equal(rootContact.get<SmallIntJdbcType>("category"), Category.Customer),
                    cb.equal(rootContact.get<SmallIntJdbcType>("category"), Category.CustomerProfessional)
                )

                Category.Professional -> listOf(
                    cb.equal(rootContact.get<SmallIntJdbcType>("category"), Category.Professional),
                    cb.equal(rootContact.get<SmallIntJdbcType>("category"), Category.CustomerProfessional)
                )

                Category.Unknown -> listOf(cb.equal(rootContact.get<SmallIntJdbcType>("category"), Category.Unknown))
                Category.CustomerProfessional -> listOf(
                    cb.equal(
                        rootContact.get<SmallIntJdbcType>("category"),
                        Category.CustomerProfessional
                    )
                )
            }
            // Combine all filters in OR
            predicates.add(cb.or(*categoryPredicates.toTypedArray()))
        }
        if (!address.isNullOrBlank()) {
            val joinWithAddress: Join<Contact, Address> = rootContact.join("addresses", JoinType.INNER)
            predicates.add(cb.equal(joinWithAddress.get<String>("address"), address))
        }
        if (!emailAddress.isNullOrBlank()) {
            val joinWithEmail: Join<Contact, Email> = rootContact.join("emails", JoinType.INNER)
            predicates.add(cb.equal(joinWithEmail.get<String>("emailAddress"), emailAddress))
        }
        if (!telephoneNumber.isNullOrBlank()) {
            val joinWithTelephone: Join<Contact, Telephone> = rootContact.join("telephones", JoinType.INNER)
            predicates.add(cb.equal(joinWithTelephone.get<String>("telephoneNumber"), telephoneNumber))
        }

        // Combine all filters in AND
        cqContact.where(*predicates.toTypedArray())
        cqContact.orderBy(cb.asc(rootContact.get<Long>("contactId")))

        val query = entityManager.createQuery(cqContact)
        query.firstResult = pageNumber * pageSize
        query.maxResults = pageSize

        return query.resultList.map { it.toDto() }
    }

    override fun getContactById(contactId: Long): ContactDetailsDTO {
        val contact = contactRepository.findById(contactId)
            .orElseThrow { ContactNotFoundException("Contact with id $contactId not found") }

        val customerId = customerRepository.findByContact(contact).getOrElse { null }?.customerId
        val professionalId = professionalRepository.findByContact(contact).getOrElse{ null }?.professionalId

        return contact.toDetailsDto(professionalId, customerId)
    }

    override fun insertNewContact(contactDTO: ContactDTO): ContactDTO? {
        val contact = Contact()
        try {
            contact.name = contactDTO.name
            contact.surname = contactDTO.surname
            contact.ssn = contactDTO.ssn
            contact.category = Category.Unknown
        } catch (e: Exception) {
            throw ContactProcessingException("Error encountered while processing contact")
        }

        logger.info("Starting insert Contact into database")
        val savedContact = contactRepository.save(contact)
        logger.info("Correctly inserted: $savedContact")

        return savedContact.toDto()
    }

    override fun updateContact(contactId: Long, newContact: ContactDTO): ContactDTO {
        logger.info("Updating contact with ID $contactId")

        val contact = contactRepository.findById(contactId)
            .orElseThrow { ContactNotFoundException("Contact with id $contactId not found") }

        contact.name = newContact.name
        contact.surname = newContact.surname
        contact.ssn = newContact.ssn

        val savedContact = contactRepository.save(contact)

        logger.info("Name updated successfully")

        return savedContact.toDto()
    }

    @Transactional
    override fun deleteContact(contactId: Long) {
        val contact = contactRepository.findById(contactId)
            .orElseThrow { ContactNotFoundException("Contact with ID $contactId not found") }

        try {
            if (contact.addresses.size > 0) {
                contact.addresses.forEach { it.addressContacts.remove(contact) }
                val addressList = contact.addresses.toList()
                addressRepository.saveAll(addressList)
            }

            if (contact.emails.size > 0) {
                contact.emails.forEach { it.emailContacts.remove(contact) }
                val emailList = contact.emails.toList()
                emailRepository.saveAll(emailList)
            }

            if (contact.telephones.size > 0) {
                contact.telephones.forEach { it.telephoneContacts.remove(contact) }
                val telephoneList = contact.telephones.toList()
                telephoneRepository.saveAll(telephoneList)
            }

            try {
                contactRepository.delete(contact)
            } catch (e: DataIntegrityViolationException) {
                if (e.cause is ConstraintViolationException) {
                    throw ContactProcessingException("Delete of contact is permitted only if the contact is not associated with a specific category")
                } else {
                    throw e
                }
            }

            logger.info("Contact with ID $contactId deleted successfully")
        } catch (e: ContactProcessingException) {
            logger.error("Error occurred while deleting contact with ID $contactId: ${e.message}")
            throw e
        } catch (e: Exception) {
            logger.error("Error occurred while deleting contact with ID $contactId: ${e.message}")
            throw ContactProcessingException("Error occurred while deleting contact with ID $contactId")
        }
    }

    /* Insert */

    @Transactional
    override fun addAddressToContact(contactId: Long, address: AddressDTO): ContactDetailsDTO {
        val contact = contactRepository.findById(contactId)
            .orElseThrow { ContactNotFoundException("Contact with ID $contactId not found") }

        var newAddress = addressRepository.findByAddress(address.address)
        if (contact.addresses.any { it.address == address.address }) {
            throw AddressConflictException("The provided address is already assigned to this contact")
        } else if (newAddress == null) {
            newAddress = Address()
            newAddress.address = address.address
        }

        contact.addAddress(newAddress)
        addressRepository.save(newAddress)

        logger.info("Address added to contact with ID $contactId")
        return contact.toDetailsDto()
    }

    @Transactional
    override fun addEmailToContact(contactId: Long, email: EmailDTO): ContactDetailsDTO? {
        val contact = contactRepository.findById(contactId)
            .orElseThrow { ContactNotFoundException("Contact with ID $contactId not found") }

        var newEmail = emailRepository.findByEmailAddress(email.emailAddress)
        if (contact.emails.any { it.emailAddress == email.emailAddress }) {
            throw EmailConflictException("The provided email address is already assigned to this contact")
        } else if (newEmail == null) {
            newEmail = Email()
            newEmail.emailAddress = email.emailAddress
        }

        contact.addEmail(newEmail)
        emailRepository.save(newEmail)

        logger.info("Email added to contact with ID $contactId")
        return contact.toDetailsDto()
    }

    @Transactional
    override fun addTelephoneToContact(contactId: Long, telephone: TelephoneDTO): ContactDetailsDTO? {
        val contact = contactRepository.findById(contactId)
            .orElseThrow { ContactNotFoundException("Contact with ID $contactId not found") }

        var newTelephone = telephoneRepository.findByTelephoneNumber(telephone.telephoneNumber)
        if (contact.telephones.any { it.telephoneNumber == telephone.telephoneNumber }) {
            throw TelephoneConflictException("The provided telephone number is already assigned to this contact")
        } else if (newTelephone == null) {
            newTelephone = Telephone()
            newTelephone.telephoneNumber = telephone.telephoneNumber
        }

        contact.addTelephone(newTelephone)
        telephoneRepository.save(newTelephone)

        logger.info("Telephone added to contact with ID $contactId")
        return contact.toDetailsDto()
    }

    /* Update */

    @Transactional
    override fun updateAddressOfContact(
        contactId: Long,
        addressId: Long,
        address: AddressDTO
    ): ContactDetailsDTO? {
        val oldAddress = addressRepository.findById(addressId)
            .orElseThrow { AddressNotFoundException("Address with ID $addressId not found") }

        val contact = contactRepository.findByContactIdAndAddresses(contactId, mutableSetOf(oldAddress))
            .orElseThrow { ContactNotFoundException("Contact with ID $contactId and address ID $addressId not found") }

        if (contact.addresses.any { it.address == address.address }) {
            throw AddressConflictException("The provided address is already assigned to this contact")
        }

        val numUsesOldAddress = contactRepository.findDistinctByAddresses(mutableSetOf(oldAddress)).size

        var newAddress = addressRepository.findByAddress(address.address)
        if (newAddress == null) {
            newAddress = Address()
            newAddress.address = address.address
        }

        oldAddress.removeContact(contact)
        if (numUsesOldAddress > 1) { // the same address is used by more than one contact
            contact.addAddress(newAddress)

            addressRepository.save(oldAddress)
            addressRepository.save(newAddress)
        } else { // the address is used only by one contact
            addressRepository.delete(oldAddress)

            contact.addAddress(newAddress)
            addressRepository.save(newAddress)
        }

        logger.info("Address updated for contact with ID $contactId")
        return contact.toDetailsDto()
    }

    @Transactional
    override fun updateEmailOfContact(contactId: Long, emailId: Long, email: EmailDTO): ContactDetailsDTO? {
        val oldEmail = emailRepository.findById(emailId)
            .orElseThrow { EmailNotFoundException("Email address with ID $emailId not found") }

        val contact = contactRepository.findByContactIdAndEmails(contactId, mutableSetOf(oldEmail))
            .orElseThrow { ContactNotFoundException("Contact with ID $contactId and email address ID $emailId not found") }

        if (contact.emails.any { it.emailAddress == email.emailAddress }) {
            throw EmailConflictException("The provided email address is already assigned to this contact")
        }

        val numUsesOldEmail = contactRepository.findDistinctByEmails(mutableSetOf(oldEmail)).size

        var newEmail = emailRepository.findByEmailAddress(email.emailAddress)
        if (newEmail == null) {
            newEmail = Email()
            newEmail.emailAddress = email.emailAddress
        }

        oldEmail.removeContact(contact)
        if (numUsesOldEmail > 1) { // the same email is used by more than one contact
            contact.addEmail(newEmail)

            emailRepository.save(oldEmail)
            emailRepository.save(newEmail)
        } else { // the email is used only by one contact
            emailRepository.delete(oldEmail)

            contact.addEmail(newEmail)
            emailRepository.save(newEmail)
        }

        logger.info("Email address updated for contact with ID $contactId")
        return contact.toDetailsDto()
    }

    @Transactional
    override fun updateTelephoneOfContact(
        contactId: Long,
        telephoneId: Long,
        telephone: TelephoneDTO
    ): ContactDetailsDTO? {
        val oldTelephone = telephoneRepository.findById(telephoneId)
            .orElseThrow { EmailNotFoundException("Telephone number with ID $telephoneId not found") }

        val contact = contactRepository.findByContactIdAndTelephones(contactId, mutableSetOf(oldTelephone))
            .orElseThrow { ContactNotFoundException("Contact with ID $contactId and telephone number ID $telephoneId not found") }

        if (contact.telephones.any { it.telephoneNumber == telephone.telephoneNumber }) {
            throw EmailConflictException("The provided telephone number is already assigned to this contact")
        }

        val numUsesOldTelephone = contactRepository.findDistinctByTelephones(mutableSetOf(oldTelephone)).size

        var newTelephone = telephoneRepository.findByTelephoneNumber(telephone.telephoneNumber)
        if (newTelephone == null) {
            newTelephone = Telephone()
            newTelephone.telephoneNumber = telephone.telephoneNumber
        }

        oldTelephone.removeContact(contact)
        if (numUsesOldTelephone > 1) { // the same telephone is used by more than one contact
            contact.addTelephone(newTelephone)

            telephoneRepository.save(oldTelephone)
            telephoneRepository.save(newTelephone)
        } else { // the telephone is used only by one contact
            telephoneRepository.delete(oldTelephone)

            contact.addTelephone(newTelephone)
            telephoneRepository.save(newTelephone)
        }

        logger.info("Telephone number updated for contact with ID $contactId")
        return contact.toDetailsDto()
    }

    /* Delete */

    @Transactional
    override fun deleteAddressFromContact(contactId: Long, addressId: Long) {
        val address = addressRepository.findById(addressId)
            .orElseThrow { AddressNotFoundException("Address with ID $addressId not found") }

        val contact = contactRepository.findByContactIdAndAddresses(contactId, mutableSetOf(address))
            .orElseThrow { ContactNotFoundException("Contact with ID $contactId and address ID $addressId not found") }

        val numUsesThisAddress = contactRepository.findDistinctByAddresses(mutableSetOf(address)).size

        if (numUsesThisAddress > 1) {
            address.removeContact(contact)
            addressRepository.save(address)
        } else {
            addressRepository.delete(address)
        }

        logger.info("Address deleted from contact with ID $contactId")
    }

    @Transactional
    override fun deleteEmailFromContact(contactId: Long, emailId: Long) {
        val email = emailRepository.findById(emailId)
            .orElseThrow { AddressNotFoundException("Email address with ID $emailId not found") }

        val contact = contactRepository.findByContactIdAndEmails(contactId, mutableSetOf(email))
            .orElseThrow { ContactNotFoundException("Contact with ID $contactId and email address ID $emailId not found") }

        val numUsesThisEmail = contactRepository.findDistinctByEmails(mutableSetOf(email)).size

        if (numUsesThisEmail > 1) {
            email.removeContact(contact)
            emailRepository.save(email)
        } else {
            emailRepository.delete(email)
        }

        logger.info("Email address deleted from contact with ID $contactId")
    }

    @Transactional
    override fun deleteTelephoneFromContact(contactId: Long, telephoneId: Long) {
        val telephone = telephoneRepository.findById(telephoneId)
            .orElseThrow { AddressNotFoundException("Telephone number with ID $telephoneId not found") }

        val contact = contactRepository.findByContactIdAndTelephones(contactId, mutableSetOf(telephone))
            .orElseThrow { ContactNotFoundException("Contact with ID $contactId and telephone number ID $telephoneId not found") }

        val numUsesThisTelephone = contactRepository.findDistinctByTelephones(mutableSetOf(telephone)).size

        if (numUsesThisTelephone > 1) {
            telephone.removeContact(contact)
            telephoneRepository.save(telephone)
        } else {
            telephoneRepository.delete(telephone)
        }

        logger.info("Telephone number deleted from contact with ID $contactId")
    }
}