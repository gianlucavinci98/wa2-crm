package it.polito.crm.entities

import it.polito.crm.dtos.MessageDTO
import it.polito.crm.dtos.MessageInfoDTO
import it.polito.crm.utils.Channel
import jakarta.persistence.*

@Entity
@Table(name = "messages")
class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val messageId: Long = 0

    @Column(name = "sender")
    lateinit var sender: String

    @Column(name = "date")
    lateinit var date: String

    @Column(name = "subject")
    lateinit var subject: String

    @Lob
    @Column(name = "body")
    lateinit var body: String

    @Column(name = "channel")
    lateinit var channel: Channel

    @Column(name = "priority")
    var priority: Int = 0

    @OneToMany(mappedBy = "message")
    val history = mutableSetOf<MessageHistory>()

    fun addNewHistoryRecord(mh: MessageHistory) {
        mh.message = this
        history.add(mh)
    }

    fun toDTO(): MessageDTO =
        MessageDTO(this.messageId, this.sender, this.date, this.subject, this.body, this.channel, this.priority)

    fun toInfoDTO(): MessageInfoDTO =
        MessageInfoDTO(this.messageId, this.sender, this.date, this.subject, this.channel, this.priority)
}