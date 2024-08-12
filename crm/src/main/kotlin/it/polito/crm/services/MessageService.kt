package it.polito.crm.services

import it.polito.crm.dtos.MessageDTO
import it.polito.crm.dtos.MessageHistoryDTO
import it.polito.crm.dtos.MessageInfoDTO
import it.polito.crm.utils.MessageStatus

interface MessageService {
    fun getMessages(pageNumber: Int, pageSize: Int, sorting: String?, messageStatus: MessageStatus?): List<MessageInfoDTO>
    fun insertNewMessage(messageDTO: MessageDTO): MessageDTO?
    fun getMessageById(messageId: Long): MessageDTO?
    fun updatePriority(messageId: Long, newPriority: Int): MessageDTO
    fun updateStatus(messageId: Long, messageHistory: MessageHistoryDTO): MessageDTO
    fun getMessageHistoryById(messageId: Long): List<MessageHistoryDTO>
}