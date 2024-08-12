package it.polito.crm.repositories

import it.polito.crm.entities.MessageHistory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MessageHistoryRepository : JpaRepository<MessageHistory, Long>