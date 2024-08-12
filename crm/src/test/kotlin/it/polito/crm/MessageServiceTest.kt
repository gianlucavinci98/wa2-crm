package it.polito.crm

import io.mockk.*
import it.polito.crm.dtos.MessageDTO
import it.polito.crm.dtos.MessageHistoryDTO
import it.polito.crm.entities.*
import it.polito.crm.repositories.*
import it.polito.crm.services.MessageServiceImpl
import it.polito.crm.utils.Category
import it.polito.crm.utils.Channel
import it.polito.crm.utils.MessageStatus
import jakarta.persistence.EntityManager
import jakarta.persistence.TypedQuery
import jakarta.persistence.criteria.*
import org.hibernate.type.descriptor.jdbc.SmallIntJdbcType
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.*

class MessageServiceImplTest {

    private val messageRepository = mockk<MessageRepository>()
    private val messageHistoryRepository = mockk<MessageHistoryRepository>()
    private val emailRepository = mockk<EmailRepository>()
    private val telephoneRepository = mockk<TelephoneRepository>()
    private val addressRepository = mockk<AddressRepository>()
    private val contactRepository = mockk<ContactRepository>()
    private val entityManager = mockk<EntityManager>()
    private val cb = mockk<CriteriaBuilder>()
    private val criteriaQuery = mockk<CriteriaQuery<Message>>()
    private val rootContact = mockk<Root<Message>>()
    private val typedQuery = mockk<TypedQuery<Message>>()
    private val join = mockk<Join<Message, MessageHistory>>()
    private val path = mockk<Path<SmallIntJdbcType>>()
    private val predicate = mockk<Predicate>()
    private val order = mockk<Order>()

    private val messageService = MessageServiceImpl(
        messageRepository,
        messageHistoryRepository,
        entityManager,
        emailRepository,
        contactRepository,
        telephoneRepository,
        addressRepository
    )

    @Test
    fun `test getMessages`() {
        // Mock data
        val pageNumber = 0
        val pageSize = 10
        val messageStatus: MessageStatus = MessageStatus.Received
        val sorting = "date"
        val messages = listOf(
            Message().apply {
                sender = "sender1@example.com"
                subject = "Subject 1"
                body = "Body 1"
                channel = Channel.Email
                date = LocalDateTime.of(2024, 5, 2, 10, 0).toString()
            },
            Message().apply {
                sender = "sender2@example.com"
                subject = "Subject 2"
                body = "Body 2"
                channel = Channel.Email
                date = LocalDateTime.of(2024, 5, 2, 11, 0).toString()
            }
            // Add more messages as needed
        )

        // Stubbing the EntityManager
        every { entityManager.criteriaBuilder } returns cb
        every { cb.createQuery(Message::class.java) } returns criteriaQuery
        every { criteriaQuery.from(Message::class.java) } returns rootContact
        every { entityManager.createQuery(criteriaQuery) } returns typedQuery
        every { typedQuery.resultList } returns messages
        every { rootContact.join<Message, MessageHistory>("history", JoinType.INNER) } returns join
        every { join.get<SmallIntJdbcType>("status") } returns path
        every { cb.equal(join.get<SmallIntJdbcType>("status"), messageStatus) } returns predicate
        every { criteriaQuery.orderBy(any<Order>()) } returns criteriaQuery
        every { typedQuery.setFirstResult(any()) } returns typedQuery
        every { typedQuery.setMaxResults(any()) } returns typedQuery
        every { criteriaQuery.where(any<Predicate>()) } returns criteriaQuery
        every { cb.asc(rootContact.get<String>("date")) } returns order

        // Call the method
        val result = messageService.getMessages(pageNumber, pageSize, sorting, messageStatus)

        // Assertions
        assertEquals(messages.size, result.size)
        // Add more assertions based on the expected behavior of your method
    }

    @Test
    fun `test insertNewMessageFromEmailWithEmailDon'tExists`() {
        // Mock data
        val messageDTO = MessageDTO(
            null,
            sender = "example@example.com",
            null,
            subject = "Test Subject",
            body = "Test Body",
            channel = Channel.Email,
            null,
        )
        val m = Message().apply {
            date = LocalDateTime.of(2012, 12, 12, 12, 12).toString()
            sender = "example@example.com"
            subject = "Test Subject"
            body = "Test Body"
            channel = Channel.Email
        }
        val messageHistory = MessageHistory().apply {
            this.date = LocalDateTime.of(2012, 12, 12, 12, 12)
            this.comment = ""
            this.messageStatus = MessageStatus.Received
        }
        val contact = Contact().apply {
            this.name = "???"
            this.surname = "???"
            this.ssn = "???"
            this.category = Category.Customer
        }
        val email = Email().apply { emailAddress = "example@example.com" }

        // Stubbing repository
        every { emailRepository.findByEmailAddress(messageDTO.sender) } returns null
        every { messageRepository.save(any<Message>()) } returns m
        every { contactRepository.save(any<Contact>()) } returns contact
        every { emailRepository.save(any<Email>()) } returns email
        every { messageHistoryRepository.save(any<MessageHistory>()) } returns messageHistory

        // Call the method
        val result = messageService.insertNewMessage(messageDTO)

        // Assertions
        assertEquals(messageDTO.sender, result?.sender)
        assertEquals(messageDTO.subject, result?.subject)
        assertEquals(messageDTO.body, result?.body)
        assertEquals(messageDTO.channel, result?.channel)

        // Verification
        verify(exactly = 1) { messageRepository.save(any<Message>()) }
        verify(exactly = 1) { messageHistoryRepository.save(any<MessageHistory>()) }
        verify(exactly = 1) { contactRepository.save(any<Contact>()) }
        verify(exactly = 1) { emailRepository.save(any<Email>()) }

    }

    @Test
    fun `test insertNewMessageFromEmailWithEmailAlreadyExists`() {
        // Mock data
        val messageDTO = MessageDTO(
            null,
            sender = "example@example.com",
            null,
            subject = "Test Subject",
            body = "Test Body",
            channel = Channel.Email,
            null
        )
        val m = Message().apply {
            date = LocalDateTime.of(2012, 12, 12, 12, 12).toString()
            sender = "example@example.com"
            subject = "Test Subject"
            body = "Test Body"
            channel = Channel.Email
        }
        val messageHistory = MessageHistory().apply {
            this.date = LocalDateTime.of(2012, 12, 12, 12, 12)
            this.comment = ""
            this.messageStatus = MessageStatus.Received
        }
        val email = Email().apply { emailAddress = "example@example.com" }

        // Stubbing repository
        every { emailRepository.findByEmailAddress(messageDTO.sender) } returns email
        every { messageRepository.save(any<Message>()) } returns m
        every { messageHistoryRepository.save(any<MessageHistory>()) } returns messageHistory

        // Call the method
        val result = messageService.insertNewMessage(messageDTO)

        // Assertions
        assertEquals(messageDTO.sender, result?.sender)
        assertEquals(messageDTO.subject, result?.subject)
        assertEquals(messageDTO.body, result?.body)
        assertEquals(messageDTO.channel, result?.channel)

        // Verification
        verify(exactly = 1) { messageRepository.save(any<Message>()) }
        verify(exactly = 1) { messageHistoryRepository.save(any<MessageHistory>()) }

    }

    @Test
    fun `test getMessageById`() {
        val messageId = 0L

        //Arrange
        val message = Message().apply {
            this.sender = "HelenaHillsSRL"
            this.date = "date"
            this.body = "This is the body of the message"
            this.channel = Channel.Email
            this.priority = 1
            this.subject = "This is the subject of the message"
        }

        every { messageRepository.findById(messageId) } returns Optional.of(message)

        //Act
        val result = messageService.getMessageById(messageId)

        //Assert
        assertEquals(0L, result?.messageId)
        assertEquals("HelenaHillsSRL", result?.sender)
        assertEquals("date", result?.date)
        assertEquals("This is the body of the message", result?.body)
        assertEquals(Channel.Email, result?.channel)
        assertEquals(1, result?.priority)
        assertEquals("This is the subject of the message", result?.subject)


    }

    @Test
    fun `test updatePriority`() {
        val messageId = 0L
        val newPriority = 10

        //Arrange
        val message = Message().apply {
            this.sender = "HelenaHillsSRL"
            this.date = LocalDateTime.of(2012, 12, 12, 12, 12).toString()
            this.body = "This is the body of the message"
            this.channel = Channel.Email
            this.priority = 1
            this.subject = "This is the subject of the message"
        }

        every { messageRepository.findById(messageId) } returns Optional.of(message)
        every { messageRepository.save(any<Message>()) } answers { firstArg() }

        //Act
        val result = messageService.updatePriority(messageId, newPriority)

        //Arrange
        assertNotNull(result)
        assertEquals(newPriority, result.priority)
    }

    @Test
    fun `test updateStatus`() {
        val messageId = 0L
        val oldHistory = MessageHistory().apply {
            this.messageStatus = MessageStatus.Received
            this.date = LocalDateTime.of(2012, 11, 11, 11, 11)
            this.comment = "This is the comment of the message"
        }
        val messageHistoryDTO = MessageHistoryDTO(
            null,
            messageStatus = MessageStatus.Read,
            date = LocalDateTime.of(2012, 12, 12, 12, 12),
            comment = "This is the NEW comment of the message"
        )
        //Arrange
        val message = Message().apply {
            this.sender = "HelenaHillsSRL"
            this.date = LocalDateTime.of(2012, 12, 12, 12, 12).toString()
            this.body = "This is the body of the message"
            this.channel = Channel.Email
            this.priority = 1
            this.subject = "This is the subject of the message"
            this.history.add(oldHistory)
        }

        //Act
        every { messageHistoryRepository.save(any<MessageHistory>()) } returnsArgument 0
        every { messageRepository.findById(messageId) } returns Optional.of(message)

        messageService.updateStatus(messageId, messageHistoryDTO)

        verify(exactly = 1) { messageRepository.findById(messageId) }
        verify(exactly = 1) { messageHistoryRepository.save(any<MessageHistory>()) }

        //Arrange

    }

    @Test
    fun `test getMessageHistoryById`() {
        // Mock data
        val messageId = 1L
        val message = Message().apply {
            this.sender = "HelenaHillsSRL"
            this.date = LocalDateTime.of(2012, 12, 12, 12, 12).toString()
            this.body = "This is the body of the message"
            this.channel = Channel.Email
            this.priority = 1
            this.subject = "This is the subject of the message"
        }
        val history1 = MessageHistory().apply {
            messageStatus = MessageStatus.Received
            date = LocalDateTime.of(2024, 5, 2, 12, 0)
            comment = "Delivered successfully"
        }
        val history2 = MessageHistory().apply {
            messageStatus = MessageStatus.Read
            date = LocalDateTime.of(2024, 5, 2, 12, 5)
            comment = "Pending delivery"
        }
        message.addNewHistoryRecord(history1)
        message.addNewHistoryRecord(history2)

        // Stubbing repository
        every { messageRepository.findById(messageId) } returns Optional.of(message)

        // Call the method
        val result = messageService.getMessageHistoryById(messageId)

        // Assertions
        assertEquals(2, result.size)
        assertEquals(MessageStatus.Received, result[0].messageStatus)
        assertEquals(LocalDateTime.of(2024, 5, 2, 12, 0), result[0].date)
        assertEquals("Delivered successfully", result[0].comment)
        assertEquals(MessageStatus.Read, result[1].messageStatus)
        assertEquals(LocalDateTime.of(2024, 5, 2, 12, 5), result[1].date)
        assertEquals("Pending delivery", result[1].comment)
    }
}