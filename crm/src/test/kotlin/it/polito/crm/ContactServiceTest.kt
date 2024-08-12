package it.polito.crm

import it.polito.crm.entities.Address
import it.polito.crm.entities.Contact
import it.polito.crm.entities.Email
import it.polito.crm.entities.Telephone
import it.polito.crm.repositories.AddressRepository
import it.polito.crm.repositories.ContactRepository
import it.polito.crm.repositories.EmailRepository
import it.polito.crm.repositories.TelephoneRepository
import jakarta.persistence.EntityManager
import org.junit.jupiter.api.Test
import io.mockk.*
import it.polito.crm.dtos.*
import it.polito.crm.services.ContactServiceImpl
import it.polito.crm.utils.*
import jakarta.persistence.TypedQuery
import jakarta.persistence.criteria.*
import org.hibernate.type.descriptor.jdbc.SmallIntJdbcType
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.assertThrows
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import java.util.*

class ContactServiceImplTest {
    private val contactRepository = mockk<ContactRepository>()
    private val addressRepository = mockk<AddressRepository>()
    private val emailRepository = mockk<EmailRepository>()
    private val telephoneRepository = mockk<TelephoneRepository>()
    private val entityManager = mockk<EntityManager>()
    private val cb = mockk<CriteriaBuilder>()
    private val criteriaQuery = mockk<CriteriaQuery<Contact>>()
    private val rootContact = mockk<Root<Contact>>()
    private val typedQuery = mockk<TypedQuery<Contact>>()
    private val joinWithAddress = mockk<Join<Contact, Address>>()
    private val joinWithEmail = mockk<Join<Contact, Email>>()
    private val joinWithTelephone = mockk<Join<Contact, Telephone>>()
    private val predicate = mockk<Predicate>()
    private val path = mockk<Path<Any?>>()
    private val order = mockk<Order>()

    private val contactService =
        ContactServiceImpl(contactRepository, addressRepository, emailRepository, telephoneRepository, entityManager)

    @Test
    fun `test getAllContacts`() {
        //Arrange
        val name = "John"
        val surname = "Doe"
        val ssn = "123456789"
        val category: Category = Category.Customer


        val telephone1 = Telephone().apply { telephoneNumber = "1234567890" }
        val email1 = Email().apply { emailAddress = "testNumber1@example.com" }
        val address1 = Address().apply { address = "Test Address" }


        val telephone2 = Telephone().apply { telephoneNumber = "1234567890" }
        val email2 = Email().apply { emailAddress = "testNumber2@example.com" }
        val address2 = Address().apply { address = "Test Address" }

        val address = "Test Address"
        val emailAddress = "testNumber2@example.com"
        val telephoneNumber = "2221112221"

        /*note : Same telephone and address but different email, so the filters should give different results*/

        val pageNumber = 0
        val pageSize = 10
        val mockPage: Page<Contact> = mockk()
        val mockContactList: List<Contact> = listOf(
            Contact().apply {
                this.name = "John"
                this.surname = "Doe"
                this.ssn = "123456789"
                this.category = Category.Customer
                this.telephones.add(telephone1)
                this.emails.add(email1)
                this.addresses.add(address1)
            },
            Contact().apply {
                this.name = "Helena"
                this.surname = "Hills"
                this.ssn = "987654321"
                this.category = Category.Professional
                this.telephones.add(telephone2)
                this.emails.add(email2)
                this.addresses.add(address2)
            }
        )

        every { contactRepository.findAll(PageRequest.of(pageNumber, pageSize)) } returns mockPage
        every { entityManager.criteriaBuilder } returns cb
        every { cb.createQuery(Contact::class.java) } returns criteriaQuery
        every { criteriaQuery.from(Contact::class.java) } returns rootContact
        every { entityManager.createQuery(criteriaQuery) } returns typedQuery
        every { typedQuery.resultList } returns mockContactList
        every { cb.equal(rootContact.get<String>("name"), name) } returns predicate
        every { cb.equal(rootContact.get<String>("surname"), surname) } returns predicate
        every { cb.equal(rootContact.get<String>("ssn"), ssn) } returns predicate
        every { cb.equal(rootContact.get<SmallIntJdbcType>("category"), category) } returns predicate
        every { cb.equal(rootContact.get<SmallIntJdbcType>("category"), Category.CustomerProfessional)} returns predicate
        val expS = 2 // Dimensione desiderata dell'array
        val predArray = Array<Predicate?>(expS) { predicate }
        every { cb.or(*predArray) } returns predicate
        every { rootContact.join<Contact, Address>("addresses", JoinType.INNER) } returns joinWithAddress
        every { rootContact.join<Contact, Email>("emails", JoinType.INNER) } returns joinWithEmail
        every { rootContact.join<Contact, Telephone>("telephones", JoinType.INNER) } returns joinWithTelephone
        every { rootContact.get<Any>("contactId") } returns path
        every { cb.equal(joinWithAddress.get<String>("address"), address) } returns predicate
        every { cb.equal(joinWithEmail.get<String>("emailAddress"), emailAddress) } returns predicate
        every { cb.equal(joinWithTelephone.get<String>("telephoneNumber"), telephoneNumber) } returns predicate
        every { cb.asc(any<Path<*>>()) } returns order
        every { criteriaQuery.orderBy(any<Order>()) } returns criteriaQuery
        every { typedQuery.setFirstResult(any()) } returns typedQuery
        every { typedQuery.setMaxResults(any()) } returns typedQuery
        every { criteriaQuery.where(any<Predicate>()) } returns criteriaQuery
        val expectedSize = 7 // Dimensione desiderata dell'array
        val predicatesArray = Array<Predicate?>(expectedSize) { predicate }
        every { criteriaQuery.where(*predicatesArray) } returns criteriaQuery
        every { mockPage.toList() } returns mockContactList

        val service = ContactServiceImpl(
            contactRepository,
            addressRepository,
            emailRepository,
            telephoneRepository,
            entityManager
        )

        //Act
        assertNotNull(service.getAllContacts(pageNumber, pageSize, "John", null, null, null, null, null, null))
        assertNotNull(service.getAllContacts(pageNumber, pageSize, null, "Doe", null, null, null, null, null))
        assertNotNull(service.getAllContacts(pageNumber, pageSize, null, null, "123456789", null, null, null, null))
        assertNotNull(
            service.getAllContacts(
                pageNumber,
                pageSize,
                null,
                null,
                null,
                Category.Customer,
                null,
                null,
                null
            )
        )
        assertNotNull(service.getAllContacts(pageNumber, pageSize, null, null, null, null, "Test Address", null, null))
        assertNotNull(
            service.getAllContacts(
                pageNumber,
                pageSize,
                null,
                null,
                null,
                null,
                null,
                "testNumber2@example.com",
                null
            )
        )
        assertNotNull(service.getAllContacts(pageNumber, pageSize, null, null, null, null, null, null, "2221112221"))
        assertNotNull(
            service.getAllContacts(
                pageNumber,
                pageSize,
                "John",
                "Doe",
                "123456789",
                Category.Customer,
                "Test Address",
                "testNumber2@example.com",
                "2221112221"
            )
        )

        // Verifica
        verify(exactly = 8) { entityManager.criteriaBuilder }
        verify(exactly = 8) { cb.createQuery(Contact::class.java) }
        verify(exactly = 8) { criteriaQuery.from(Contact::class.java) }
        verify(exactly = 2) { cb.equal(rootContact.get<String>("name"), name) }
        verify(exactly = 2) { cb.equal(rootContact.get<String>("surname"), surname) }
        verify(exactly = 2) { cb.equal(rootContact.get<String>("ssn"), ssn) }
        verify(atLeast = 2) { cb.equal(rootContact.get<String>("category"), category) }
        verify(exactly = 2) { cb.equal(joinWithAddress.get<String>("address"), address) }
        verify(exactly = 2) { cb.equal(joinWithEmail.get<String>("emailAddress"), emailAddress) }
        verify(exactly = 2) { cb.equal(joinWithTelephone.get<String>("telephoneNumber"), telephoneNumber) }
        verify(exactly = 8) { entityManager.createQuery(criteriaQuery) }
        verify(exactly = 8) { typedQuery.setFirstResult(0) }
        verify(exactly = 8) { typedQuery.setMaxResults(10) }
        verify(exactly = 8) { typedQuery.resultList }
    }

    @Test
    fun `test insert new contact`() {
        val contactDTO = ContactDTO(
            null,
            name = "John",
            surname = "Doe",
            ssn = "1234567890",
            category = Category.Customer
        )
        val savedContact = Contact().apply {
            name = "John"
            surname = "Doe"
            ssn = "1234567890"
            category = Category.Customer
        }
        every { contactRepository.save(any<Contact>()) } returns savedContact

        val result = contactService.insertNewContact(contactDTO)

        assertEquals("John", result?.name)
        assertEquals("Doe", result?.surname)
        assertEquals("1234567890", result?.ssn)
        assertEquals(Category.Customer, result?.category)
    }

    @Test
    fun `test insert new contact should throw ContactProcessingException`() {
        // Arrange
        val contactDTO = ContactDTO(null, "John", "Doe", "1234567890", Category.Customer)
        every { contactRepository.save(any()) } throws ContactProcessingException("message")

        // Act & Assert
        assertThrows<ContactProcessingException> { contactService.insertNewContact(contactDTO) }

        verify(exactly = 1) { contactRepository.save(any()) }
    }

    @Test
    fun testAddAddressToContact() {
        // Creazione dei mock
        val contactId = 1L
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Customer
        }

        every { contactRepository.findById(contactId) } returns Optional.of(contact)
        every { addressRepository.findByAddress(any()) } returns null
        every { addressRepository.save(any<Address>()) } returnsArgument 0

        // Esecuzione del metodo del servizio
        val createAddressDTO = AddressDTO(null, "Test Address")
        val result = contactService.addAddressToContact(contactId, createAddressDTO)

        // Verifica delle interazioni
        verify(exactly = 1) { contactRepository.findById(contactId) }
        verify(exactly = 1) { addressRepository.findByAddress(createAddressDTO.address) }
        verify(exactly = 1) { addressRepository.save(any<Address>()) }

        // Assert
        assertNotNull(result)
        assertEquals(1, result.addresses.size)
        assertEquals(createAddressDTO.address, result.addresses.firstOrNull()?.address)
    }

    @Test
    fun `test add existing address to contact should throw AddressConflictException`() {
        // Arrange
        val contactId = 1L
        val addressDTO = AddressDTO(null, "123 Main St")
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "1234567890"
            this.category = Category.Customer
        }
        val existingAddress = Address().apply {
            this.address = "123 Main St"
        }
        contact.addAddress(existingAddress)
        every { contactRepository.findById(contactId) } returns Optional.of(contact)
        every { addressRepository.findByAddress(addressDTO.address) } returns existingAddress

        // Act & Assert
        assertThrows<AddressConflictException> { contactService.addAddressToContact(contactId, addressDTO) }

        verify(exactly = 1) { contactRepository.findById(contactId) }
        verify(exactly = 1) { addressRepository.findByAddress(addressDTO.address) }
        verify(exactly = 0) { addressRepository.save(any()) }
    }

    @Test
    fun `test add address to non-existing contact should throw ContactNotFoundException`() {
        // Arrange
        val contactId = 1L
        val addressDTO = AddressDTO(null, "123 Main St")
        every { contactRepository.findById(contactId) } returns Optional.empty()

        // Act & Assert
        assertThrows<ContactNotFoundException> { contactService.addAddressToContact(contactId, addressDTO) }

        verify(exactly = 1) { contactRepository.findById(contactId) }
    }

    @Test
    fun testAddEmailToContact() {
        // Creazione dei mock
        val contactId = 1L
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Customer
        }

        every { contactRepository.findById(contactId) } returns Optional.of(contact)
        every { emailRepository.findByEmailAddress(any()) } returns null
        every { emailRepository.save(any<Email>()) } returnsArgument 0

        // Esecuzione del metodo del servizio
        val createEmailDTO = EmailDTO(null, "test@example.com")
        val result = contactService.addEmailToContact(contactId, createEmailDTO)

        // Verifica delle interazioni
        verify(exactly = 1) { contactRepository.findById(contactId) }
        verify(exactly = 1) { emailRepository.findByEmailAddress(createEmailDTO.emailAddress) }
        verify(exactly = 1) { emailRepository.save(any<Email>()) }

        // Assert
        assertNotNull(result)
        assertEquals(1, result?.emails?.size)
        assertEquals(createEmailDTO.emailAddress, result?.emails?.firstOrNull()?.emailAddress)
    }

    @Test
    fun `test add existing email to contact should throw EmailConflictException`() {
        // Arrange
        val contactId = 1L
        val emailDTO = EmailDTO(null, "s123456@polito.it")
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "1234567890"
            this.category = Category.Customer
        }
        val existingEmail = Email().apply {
            this.emailAddress = "s123456@polito.it"
        }
        contact.addEmail(existingEmail)
        every { contactRepository.findById(contactId) } returns Optional.of(contact)
        every { emailRepository.findByEmailAddress(emailDTO.emailAddress) } returns existingEmail

        // Act & Assert
        assertThrows<EmailConflictException> { contactService.addEmailToContact(contactId, emailDTO) }

        verify(exactly = 1) { contactRepository.findById(contactId) }
        verify(exactly = 1) { emailRepository.findByEmailAddress(emailDTO.emailAddress) }
        verify(exactly = 0) { emailRepository.save(any()) }
    }

    @Test
    fun `test add email to non-existing contact should throw ContactNotFoundException`() {
        // Arrange
        val contactId = 1L
        val emailDTO = EmailDTO(null, "s123456@polito.it")
        every { contactRepository.findById(contactId) } returns Optional.empty()

        // Act & Assert
        assertThrows<ContactNotFoundException> { contactService.addEmailToContact(contactId, emailDTO) }

        verify(exactly = 1) { contactRepository.findById(contactId) }
    }

    @Test
    fun testAddTelephoneToContact() {
        // Creazione dei mock
        val contactId = 1L
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Customer
        }

        every { contactRepository.findById(contactId) } returns Optional.of(contact)
        every { telephoneRepository.findByTelephoneNumber(any()) } returns null
        every { telephoneRepository.save(any<Telephone>()) } returnsArgument 0

        // Esecuzione del metodo del servizio
        val createTelephoneDTO = TelephoneDTO(null, "1234567890")
        val result = contactService.addTelephoneToContact(contactId, createTelephoneDTO)

        // Verifica delle interazioni
        verify(exactly = 1) { contactRepository.findById(contactId) }
        verify(exactly = 1) { telephoneRepository.findByTelephoneNumber(createTelephoneDTO.telephoneNumber) }
        verify(exactly = 1) { telephoneRepository.save(any<Telephone>()) }

        // Assert
        assertNotNull(result)
        assertEquals(1, result?.telephones?.size)
        assertEquals(createTelephoneDTO.telephoneNumber, result?.telephones?.firstOrNull()?.telephoneNumber)
    }

    @Test
    fun `test add existing telephone to contact should throw TelephoneConflictException`() {
        // Arrange
        val contactId = 1L
        val telephoneDTO = TelephoneDTO(null, "123456789")
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "1234567890"
            this.category = Category.Customer
        }
        val existsTelephone = Telephone().apply {
            this.telephoneNumber = "123456789"
        }
        contact.addTelephone(existsTelephone)
        every { contactRepository.findById(contactId) } returns Optional.of(contact)
        every { telephoneRepository.findByTelephoneNumber(telephoneDTO.telephoneNumber) } returns existsTelephone

        // Act & Assert
        assertThrows<TelephoneConflictException> { contactService.addTelephoneToContact(contactId, telephoneDTO) }

        verify(exactly = 1) { contactRepository.findById(contactId) }
        verify(exactly = 1) { telephoneRepository.findByTelephoneNumber(telephoneDTO.telephoneNumber) }
        verify(exactly = 0) { telephoneRepository.save(any()) }
    }

    @Test
    fun `test add telephone to non-existing contact should throw ContactNotFoundException`() {
        // Arrange
        val contactId = 1L
        val telephoneDTO = TelephoneDTO(null, "123456789")
        every { contactRepository.findById(contactId) } returns Optional.empty()

        // Act & Assert
        assertThrows<ContactNotFoundException> { contactService.addTelephoneToContact(contactId, telephoneDTO) }

        verify(exactly = 1) { contactRepository.findById(contactId) }
    }

    @Test
    fun testUpdateAddressOfContact() {
        // Creazione dei mock
        val contactId = 1L
        val addressId = 1L
        val oldAddress = Address().apply { address = "Old Address" }
        val addressDTO = AddressDTO(null, "New Address")
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Customer
            this.addresses.add(oldAddress)
        }

        every { addressRepository.findById(addressId) } returns Optional.of(oldAddress)
        every {
            contactRepository.findByContactIdAndAddresses(
                contactId,
                mutableSetOf(oldAddress)
            )
        } returns Optional.of(contact)
        every { contactRepository.findDistinctByAddresses(mutableSetOf(oldAddress)) } returns listOf(contact)
        every { addressRepository.findByAddress(addressDTO.address) } returns null
        every { addressRepository.save(any<Address>()) } returnsArgument 0
        every { addressRepository.delete(any<Address>()) } just Runs

        // Esecuzione del metodo del servizio
        val result = contactService.updateAddressOfContact(contactId, addressId, addressDTO)

        // Verifica delle interazioni
        verify(exactly = 1) { addressRepository.findById(addressId) }
        verify(exactly = 1) { contactRepository.findByContactIdAndAddresses(contactId, mutableSetOf(oldAddress)) }
        verify(exactly = 1) { addressRepository.findByAddress(addressDTO.address) }
        verify(exactly = 1) { addressRepository.save(any<Address>()) }

        // Assert
        assertNotNull(result)
        assertEquals(1, result?.addresses?.size)
        assertEquals(addressDTO.address, result?.addresses?.firstOrNull()?.address)
    }

    @Test
    fun testUpdateEmailOfContact() {
        // Creazione dei mock
        val contactId = 1L
        val emailAddressId = 1L
        val oldEmailAddress = Email().apply { emailAddress = "Old Address" }
        val emailAddressDTO = EmailDTO(null, "New Address")
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Customer
            this.emails.add(oldEmailAddress)
        }

        every { emailRepository.findById(emailAddressId) } returns Optional.of(oldEmailAddress)
        every {
            contactRepository.findByContactIdAndEmails(
                contactId,
                mutableSetOf(oldEmailAddress)
            )
        } returns Optional.of(contact)
        every { emailRepository.findByEmailAddress(emailAddressDTO.emailAddress) } returns null
        every { contactRepository.findDistinctByEmails(mutableSetOf(oldEmailAddress)) } returns listOf(contact)
        every { emailRepository.delete(any<Email>()) } just Runs
        every { emailRepository.save(any<Email>()) } returnsArgument 0

        // Esecuzione del metodo del servizio
        val result = contactService.updateEmailOfContact(contactId, emailAddressId, emailAddressDTO)

        // Verifica delle interazioni
        verify(exactly = 1) { emailRepository.findById(emailAddressId) }
        verify(exactly = 1) { contactRepository.findByContactIdAndEmails(contactId, mutableSetOf(oldEmailAddress)) }
        verify(exactly = 1) { emailRepository.findByEmailAddress(emailAddressDTO.emailAddress) }
        verify(exactly = 1) { emailRepository.save(any<Email>()) }

        // Assert
        assertNotNull(result)
        assertEquals(1, result?.emails?.size)
        assertEquals(emailAddressDTO.emailAddress, result?.emails?.firstOrNull()?.emailAddress)
    }

    @Test
    fun testUpdateTelephoneOfContact() {
        // Creazione dei mock
        val contactId = 1L
        val telephoneId = 1L
        val oldTelephoneNumber = Telephone().apply { telephoneNumber = "3333333333" }
        val telephoneDTO = TelephoneDTO(null, "3311111111")
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Customer
            this.telephones.add(oldTelephoneNumber)
        }

        every { telephoneRepository.findById(telephoneId) } returns Optional.of(oldTelephoneNumber)
        every {
            contactRepository.findByContactIdAndTelephones(
                contactId,
                mutableSetOf(oldTelephoneNumber)
            )
        } returns Optional.of(contact)
        every { telephoneRepository.findByTelephoneNumber(telephoneDTO.telephoneNumber) } returns null
        every { telephoneRepository.save(any<Telephone>()) } returnsArgument 0
        every { contactRepository.findDistinctByTelephones(mutableSetOf(oldTelephoneNumber)) } returns listOf(contact)
        every { telephoneRepository.delete(any<Telephone>()) } just Runs

        // Esecuzione del metodo del servizio
        val result = contactService.updateTelephoneOfContact(contactId, telephoneId, telephoneDTO)

        // Verifica delle interazioni
        verify(exactly = 1) { telephoneRepository.findById(telephoneId) }
        verify(exactly = 1) {
            contactRepository.findByContactIdAndTelephones(
                contactId,
                mutableSetOf(oldTelephoneNumber)
            )
        }
        verify(exactly = 1) { telephoneRepository.findByTelephoneNumber(telephoneDTO.telephoneNumber) }
        verify(exactly = 1) { telephoneRepository.save(any<Telephone>()) }

        // Assert
        assertNotNull(result)
        assertEquals(1, result?.telephones?.size)
        assertEquals(telephoneDTO.telephoneNumber, result?.telephones?.firstOrNull()?.telephoneNumber)
    }

    @Test
    fun testDeleteAddressFromContact() {
        // Creazione dei mock
        val contactId = 1L
        val addressId = 1L
        val address = Address().apply { address = "Test Address" }
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Customer
            this.addresses.add(address)
        }

        every { addressRepository.findById(addressId) } returns Optional.of(address)
        every { contactRepository.findByContactIdAndAddresses(contactId, mutableSetOf(address)) } returns Optional.of(
            contact
        )
        every { contactRepository.findDistinctByAddresses(mutableSetOf(address)) } returns listOf(contact)
        every { addressRepository.save(address) } returnsArgument 0
        every { addressRepository.delete(address) } returns Unit

        // Esecuzione del metodo del servizio
        contactService.deleteAddressFromContact(contactId, addressId)

        // Verifica delle interazioni
        verify(exactly = 1) { addressRepository.findById(addressId) }
        verify(exactly = 1) { contactRepository.findByContactIdAndAddresses(contactId, mutableSetOf(address)) }
        verify(exactly = 1) { contactRepository.findDistinctByAddresses(mutableSetOf(address)) }
        verify(exactly = 1) { addressRepository.delete(address) }


        every { contactRepository.findDistinctByAddresses(mutableSetOf(address)).size } returns 2

        // Esecuzione del metodo del servizio se c'è un altro contatto
        contactService.deleteAddressFromContact(contactId, addressId)

        // Verifica delle interazioni
        verify(exactly = 1) { addressRepository.save(address) }
    }

    @Test
    fun testDeleteEmailFromContact() {
        // Creazione dei mock
        val contactId = 1L
        val emailId = 1L
        val email = Email().apply { emailAddress = "test@example.com" }
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Customer
            this.emails.add(email)
        }

        every { emailRepository.findById(emailId) } returns Optional.of(email)
        every {
            contactRepository.findByContactIdAndEmails(
                contactId,
                mutableSetOf(email)
            )
        } returns Optional.of(contact)
        every { contactRepository.findDistinctByEmails(mutableSetOf(email)) } returns listOf(contact)
        every { emailRepository.save(email) } returnsArgument 0
        every { emailRepository.delete(email) } returns Unit

        // Esecuzione del metodo del servizio
        contactService.deleteEmailFromContact(contactId, emailId)

        // Verifica delle interazioni
        verify(exactly = 1) { emailRepository.findById(emailId) }
        verify(exactly = 1) { contactRepository.findByContactIdAndEmails(contactId, mutableSetOf(email)) }
        verify(exactly = 1) { contactRepository.findDistinctByEmails(mutableSetOf(email)) }
        verify(exactly = 1) { emailRepository.delete(email) }

        every { contactRepository.findDistinctByEmails(mutableSetOf(email)).size } returns 2

        // Esecuzione del metodo del servizio se c'è un altro contatto
        contactService.deleteEmailFromContact(contactId, emailId)

        // Verifica delle interazioni
        verify(exactly = 1) { emailRepository.save(email) }
    }

    @Test
    fun testDeleteTelephoneFromContact() {
        // Creazione dei mock
        val contactId = 1L
        val telephoneId = 1L
        val telephone = Telephone().apply { telephoneNumber = "1234567890" }
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Customer
            this.telephones.add(telephone)
        }

        every { telephoneRepository.findById(telephoneId) } returns Optional.of(telephone)
        every {
            contactRepository.findByContactIdAndTelephones(
                contactId,
                mutableSetOf(telephone)
            )
        } returns Optional.of(contact)
        every { contactRepository.findDistinctByTelephones(mutableSetOf(telephone)) } returns listOf(contact)
        every { telephoneRepository.save(telephone) } returnsArgument 0
        every { telephoneRepository.delete(telephone) } returns Unit

        // Esecuzione del metodo del servizio
        contactService.deleteTelephoneFromContact(contactId, telephoneId)

        // Verifica delle interazioni
        verify(exactly = 1) { telephoneRepository.findById(telephoneId) }
        verify(exactly = 1) { contactRepository.findByContactIdAndTelephones(contactId, mutableSetOf(telephone)) }
        verify(exactly = 1) { contactRepository.findDistinctByTelephones(mutableSetOf(telephone)) }
        verify(exactly = 1) { telephoneRepository.delete(telephone) }

        every { contactRepository.findDistinctByTelephones(mutableSetOf(telephone)).size } returns 2

        // Esecuzione del metodo del servizio se c'è un altro contatto
        contactService.deleteTelephoneFromContact(contactId, telephoneId)

        // Verifica delle interazioni
        verify(exactly = 1) { telephoneRepository.save(telephone) }

    }

    @Test
    fun testUpdateContact() {
        // Creazione dei mock
        val contactId = 1L
        val newContact = ContactDTO(null, "John", "Doe", "123456789", Category.Professional)
        val contact = Contact().apply {
            this.name = "OldName"
            this.surname = "OldSurname"
            this.ssn = "OldSSN"
            this.category = Category.Customer
        }

        every { contactRepository.findById(contactId) } returns Optional.of(contact)
        every { contactRepository.save(any<Contact>()) } answers { firstArg() }

        // Esecuzione del metodo del servizio
        val result = contactService.updateContact(contactId, newContact)

        // Verifica delle interazioni
        verify(exactly = 1) { contactRepository.findById(contactId) }
        verify(exactly = 1) { contactRepository.save(any<Contact>()) }

        // Assert
        assertNotNull(result)
        assertEquals(newContact.name, result.name)
        assertEquals(newContact.surname, result.surname)
        assertEquals(newContact.ssn, result.ssn)
    }

    @Test
    fun `test update non-existing contact should throw ContactNotFoundException`() {
        // Arrange
        val contactId = 1L
        val newContactDTO = ContactDTO(null, "John", "Doe", "1234567890", Category.Customer)
        every { contactRepository.findById(contactId) } returns Optional.empty()

        // Act & Assert
        assertThrows<ContactNotFoundException> { contactService.updateContact(contactId, newContactDTO) }

        verify(exactly = 1) { contactRepository.findById(contactId) }
    }

    /*@Test
    fun testUpdateCategory() {
        // Creazione dei mock
        val contactId = 1L
        val newCategory = Category.Customer
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Professional
        }

        every { contactRepository.findById(contactId) } returns Optional.of(contact)
        every { contactRepository.save(any<Contact>()) } answers { firstArg() }

        // Esecuzione del metodo del servizio
        val result = contactService.updateCategory(contactId, newCategory)

        // Verifica delle interazioni
        verify(exactly = 1) { contactRepository.findById(contactId) }
        verify(exactly = 1) { contactRepository.save(any<Contact>()) }

        // Assert
        assertNotNull(result)
        assertEquals(newCategory, result.category)
    }*/

    /*@Test
    fun `test update category of non-existing contact should throw ContactNotFoundException`() {
        // Arrange
        val contactId = 1L
        val newCategory = Category.Professional
        every { contactRepository.findById(contactId) } returns Optional.empty()

        // Act & Assert
        assertThrows<ContactNotFoundException> { contactService.updateCategory(contactId, newCategory) }

        verify(exactly = 1) { contactRepository.findById(contactId) }
    }*/

    @Test
    fun testDeleteContact() {
        // Creazione dei mock
        val contactId = 1L
        val contact = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Professional
        }

        every { contactRepository.findById(contactId) } returns Optional.of(contact)
        every { contactRepository.delete(contact) } just runs
        every { addressRepository.saveAll(any<List<Address>>()) } answers { firstArg() }
        every { emailRepository.saveAll(any<List<Email>>()) } answers { firstArg() }
        every { telephoneRepository.saveAll(any<List<Telephone>>()) } answers { firstArg() }

        // Esecuzione del metodo del servizio
        assertDoesNotThrow { contactService.deleteContact(contactId) }

        // Verifica delle interazioni
        verify(exactly = 1) { contactRepository.findById(contactId) }
        verify(exactly = 1) { contactRepository.delete(contact) }

        val contact2Id = 0L
        val telephone = Telephone().apply { telephoneNumber = "1234567890" }
        val email = Email().apply { emailAddress = "test@example.com" }
        val address = Address().apply { address = "Test Address" }


        val contact2 = Contact().apply {
            this.name = "John"
            this.surname = "Doe"
            this.ssn = "123456789"
            this.category = Category.Customer
            this.telephones.add(telephone)
            this.emails.add(email)
            this.addresses.add(address)
        }

        every { contactRepository.findById(contact2Id) } returns Optional.of(contact2)
        every { contactRepository.delete(contact2) } just runs
        every { addressRepository.saveAll(any<List<Address>>()) } answers { firstArg() }
        every { emailRepository.saveAll(any<List<Email>>()) } answers { firstArg() }
        every { telephoneRepository.saveAll(any<List<Telephone>>()) } answers { firstArg() }

        assertDoesNotThrow { contactService.deleteContact(contact2Id) }

        verify(exactly = 1) { addressRepository.saveAll(any<List<Address>>()) }
        verify(exactly = 1) { emailRepository.saveAll(any<List<Email>>()) }
        verify(exactly = 1) { telephoneRepository.saveAll(any<List<Telephone>>()) }
    }

    @Test
    fun `test delete non-existing contact should throw ContactNotFoundException`() {
        // Arrange
        val contactId = 1L
        every { contactRepository.findById(contactId) } returns Optional.empty()

        // Act & Assert
        assertThrows<ContactNotFoundException> { contactService.deleteContact(contactId) }

        verify(exactly = 1) { contactRepository.findById(contactId) }
    }
}