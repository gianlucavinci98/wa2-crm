package it.polito.crm.services

import it.polito.crm.dtos.MessageDTO
import it.polito.crm.dtos.MessageHistoryDTO
import it.polito.crm.dtos.MessageInfoDTO
import it.polito.crm.entities.*
import it.polito.crm.repositories.*
import it.polito.crm.utils.*
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.*
import org.hibernate.type.descriptor.jdbc.SmallIntJdbcType
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.RestTemplate
import java.time.LocalDateTime

const val COMMUNICATION_MANAGER_URL = "http://localhost:8081/api/emails"

@Service
class MessageServiceImpl(
    private val messageRepository: MessageRepository,
    private val messageHistoryRepository: MessageHistoryRepository,
    private val entityManager: EntityManager,
    private val emailRepository: EmailRepository,
    private val contactRepository: ContactRepository,
    private val telephoneRepository: TelephoneRepository,
    private val addressRepository: AddressRepository
) : MessageService {
    private val logger = LoggerFactory.getLogger(MessageServiceImpl::class.java)

    @Transactional
    override fun getMessages(
        pageNumber: Int,
        pageSize: Int,
        sorting: String?,
        messageStatus: MessageStatus?
    ): List<MessageInfoDTO> {
        val cb: CriteriaBuilder = entityManager.criteriaBuilder

        val cqMessage: CriteriaQuery<Message> = cb.createQuery(Message::class.java)
        val rootMessage: Root<Message> = cqMessage.from(Message::class.java)

        val predicates = mutableListOf<Predicate>()

        messageStatus?.let {
            predicates.add(cb.equal(rootMessage.get<MessageStatus>("status"), it))
        }

        // Combine all filter in AND
        cqMessage.where(*predicates.toTypedArray())
        if (sorting != null && sorting.lowercase() == "date") {
            cqMessage.orderBy(cb.desc(rootMessage.get<String>("date")))
        }

        val query = entityManager.createQuery(cqMessage)
        query.firstResult = pageNumber * pageSize
        query.maxResults = pageSize

        return query.resultList.map { it.toInfoDTO() }
    }

    override fun insertNewMessage(messageDTO: MessageDTO): MessageDTO? {
        val m = Message()
        val mh = MessageHistory()

        try {
            if (messageDTO.sender.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"))) {
                // email
                if (messageDTO.channel != Channel.Email) {
                    throw MessageSenderChannelCoherence("The sender ${messageDTO.sender} value is not coherent with the channel type ${messageDTO.channel}")
                }

                if (emailRepository.findByEmailAddress(messageDTO.sender) == null) {
                    val newContact = Contact()
                    val newEmail = Email()

                    newContact.name = "???"
                    newContact.surname = "???"
                    newContact.ssn = "???"
                    newContact.category = Category.Unknown

                    newEmail.emailAddress = messageDTO.sender

                    newContact.addEmail(newEmail)

                    contactRepository.save(newContact)
                    emailRepository.save(newEmail)
                }
            } else if (messageDTO.sender.matches(Regex("^\\+?[0-9]{1,3}[ -]?[0-9]{3,}$"))) {
                // telephone
                if (messageDTO.channel != Channel.Telephone) {
                    throw MessageSenderChannelCoherence("The sender ${messageDTO.sender} value is not coherent with the channel type ${messageDTO.channel}")
                }

                if (telephoneRepository.findByTelephoneNumber(messageDTO.sender) == null) {
                    val newContact = Contact()
                    val newTelephone = Telephone()

                    newContact.name = "???"
                    newContact.surname = "???"
                    newContact.ssn = "???"
                    newContact.category = Category.Unknown

                    newTelephone.telephoneNumber = messageDTO.sender

                    newContact.addTelephone(newTelephone)

                    contactRepository.save(newContact)
                    telephoneRepository.save(newTelephone)
                }
            } else {
                // address
                if (messageDTO.channel != Channel.Address) {
                    throw MessageSenderChannelCoherence("The sender ${messageDTO.sender} value is not coherent with the channel type ${messageDTO.channel}")
                }

                if (addressRepository.findByAddress(messageDTO.sender) == null) {
                    val newContact = Contact()
                    val newAddress = Address()

                    newContact.name = "???"
                    newContact.surname = "???"
                    newContact.ssn = "???"
                    newContact.category = Category.Unknown

                    newAddress.address = messageDTO.sender

                    newContact.addAddress(newAddress)

                    contactRepository.save(newContact)
                    addressRepository.save(newAddress)
                }
            }

            m.subject = messageDTO.subject ?: ""
            m.body = messageDTO.body ?: ""
            m.date = LocalDateTime.now().toString()
            m.sender = messageDTO.sender
            m.channel = messageDTO.channel
            m.priority = 0
            m.hasAttachments = messageDTO.hasAttachments

            mh.messageStatus = MessageStatus.Received
            mh.date = LocalDateTime.now()
            mh.comment = ""
            m.addNewHistoryRecord(mh)
        } catch (e: MessageSenderChannelCoherence) {
            throw e
        } catch (e: Exception) {
            throw MessageProcessingException("Error encountered while processing message")
        }

        logger.info("Starting insert Message into database")
        val savedMessage = messageRepository.save(m)
        messageHistoryRepository.save(mh)
        logger.info("Correctly inserted: $savedMessage")

        return savedMessage.toDTO()
    }

    override fun getMessageById(messageId: Long): MessageDTO? {
        val m = messageRepository.findById(messageId)
            .orElseThrow { MessageNotFoundException("Message with id $messageId not found") }

        if (m.status == MessageStatus.Received) {
            updateStatus(messageId, MessageHistoryDTO(null, MessageStatus.Read, null, ""))
        }

        return m.toDTO()
    }

    override fun updatePriority(messageId: Long, newPriority: Int): MessageDTO {
        logger.info("Updating role of contact with ID $messageId to $newPriority")

        val m = messageRepository.findById(messageId)
            .orElseThrow { MessageNotFoundException("Message with id $messageId not found") }

        m.priority = newPriority

        val saved = messageRepository.save(m)
        logger.info("Priority updated successfully")

        return saved.toDTO()
    }

    override fun updateStatus(messageId: Long, messageHistory: MessageHistoryDTO): MessageDTO {
        val message = messageRepository.findById(messageId)
            .orElseThrow { MessageNotFoundException("Message with id $messageId not found") }
        val lastHistoryRecord = message.history.maxByOrNull { it.date }

        val newMessageHistory = MessageHistory()
        val messageStatusChecker = MessageStatusChecker()

        if (messageStatusChecker.compare(messageHistory.messageStatus, lastHistoryRecord?.messageStatus) == 1) {
            try {
                newMessageHistory.comment = messageHistory.comment ?: ""
                newMessageHistory.messageStatus = messageHistory.messageStatus
                newMessageHistory.date = LocalDateTime.now()

                message.addNewHistoryRecord(newMessageHistory)
            } catch (e: Exception) {
                throw MessageProcessingException("Error encountered while processing message")
            }
        } else {
            throw MessageStatusException("It is not possible to switch from the current state to the next one")
        }

        logger.info("Starting insert new status into database")
        val savedMessageHistory = messageHistoryRepository.save(newMessageHistory)
        message.status = messageHistory.messageStatus
        messageRepository.save(message)
        logger.info("Correctly inserted: $savedMessageHistory")

        if (message.channel == Channel.Email) {
            val restTemplate = RestTemplate()

            val headers = HttpHeaders()
            headers.contentType = MediaType.MULTIPART_FORM_DATA

            val body = LinkedMultiValueMap<String, Any>()
            body.add("destinationEmail", message.sender)
            body.add("subject", "Update message status")
            body.add(
                "body",
                "There is an update regarding the status of the message you sent. Your message passed from state ${lastHistoryRecord?.messageStatus?.name} to state ${newMessageHistory.messageStatus.name}.\n\nMessage:\n${message.body}"
            )

            try {
                val requestEntity = HttpEntity(body, headers)
                restTemplate.postForEntity(COMMUNICATION_MANAGER_URL, requestEntity, String::class.java)
                logger.info("Successfully send update email to contact's address: ${message.sender}")
            } catch (e: Exception) {
                logger.error("Failed to send update email to contact's address: ${message.sender}. With error: ${e.message}")
            }
        }

        return message.toDTO()
    }

    override fun getMessageHistoryById(messageId: Long): List<MessageHistoryDTO> {
        val message = messageRepository.findById(messageId)
            .orElseThrow { MessageNotFoundException("Message with id $messageId not found") }

        return message.history.toList().map { it.toDTO() }
    }
}