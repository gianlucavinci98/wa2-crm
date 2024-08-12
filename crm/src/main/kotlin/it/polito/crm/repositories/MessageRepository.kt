package it.polito.crm.repositories

import it.polito.crm.entities.Message
import it.polito.crm.entities.MessageHistory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface MessageRepository : PagingAndSortingRepository<Message, Long>, JpaRepository<Message, Long> {
    fun findByMessageIdAndHistory(messageId: Long, mutableSetOf: MutableSet<MessageHistory>): Optional<Message>
    abstract fun findDistinctByHistory(mutableSetOf: MutableSet<MessageHistory>): List<Message>
}