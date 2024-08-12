package it.polito.crm.entities

import it.polito.crm.dtos.MessageHistoryDTO
import it.polito.crm.utils.MessageStatus
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "messages_history")
class MessageHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val messageHistoryId: Long = 0

    @ManyToOne
    var message: Message? = null

    @Column(name = "status")
    lateinit var messageStatus: MessageStatus

    @Column(name = "date")
    lateinit var date: LocalDateTime

    @Column(name = "comment")
    lateinit var comment: String

    fun toDTO(): MessageHistoryDTO =
        MessageHistoryDTO(this.messageHistoryId, this.messageStatus, this.date, this.comment)
}