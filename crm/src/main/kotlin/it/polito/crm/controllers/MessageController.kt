package it.polito.crm.controllers

import it.polito.crm.dtos.MessageDTO
import it.polito.crm.dtos.MessageHistoryDTO
import it.polito.crm.dtos.MessageInfoDTO
import it.polito.crm.services.MessageService
import it.polito.crm.utils.MessageStatus
import jakarta.validation.Valid
import jakarta.validation.constraints.Min
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/messages")
class MessageController(private val messageService: MessageService) {
    @GetMapping("", "/")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    fun getMessages(
        @RequestParam("pageNumber", required = false) @Min(
            value = 0,
            message = "Page number not valid, value must be great or equal to 0"
        ) pageNumber: Int = 0,
        @RequestParam("pageSize", required = false) @Min(
            value = 1,
            message = "Page size not valid, value must be great or equal to 1"
        ) pageSize: Int = 20,
        @RequestParam("sorting", required = false) sorting: String?,
        @RequestParam("messageStatus", required = false) messageStatus: MessageStatus?
    ): List<MessageInfoDTO> {
        return messageService.getMessages(pageNumber, pageSize, sorting, messageStatus)
    }

    @PostMapping("", "/")
    fun insertNewMessage(@Valid @RequestBody messageDTO: MessageDTO): ResponseEntity<MessageDTO> {
        val createdMessage = messageService.insertNewMessage(messageDTO)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMessage)
    }

    @GetMapping("/{messageId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    fun getMessageById(@PathVariable messageId: Long): ResponseEntity<MessageDTO> {
        val m = messageService.getMessageById(messageId)
        return ResponseEntity.status(HttpStatus.OK).body(m)
    }

    @PutMapping("/{messageId}/priority")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun updatePriority(
        @PathVariable messageId: Long,
        @Min(value = 0, message = "Invalid priority, it must be equal or greater than 0") @RequestBody priority: Int
    ): ResponseEntity<MessageDTO> {
        val updatedMessage = messageService.updatePriority(messageId, priority)
        return ResponseEntity.status(HttpStatus.OK).body(updatedMessage)
    }

    @PostMapping("/{messageId}/status")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun updateStatus(
        @PathVariable messageId: Long,
        @Valid @RequestBody messageHistory: MessageHistoryDTO
    ): ResponseEntity<MessageDTO> {
        val m = messageService.updateStatus(messageId, messageHistory)
        return ResponseEntity.status(HttpStatus.CREATED).body(m)
    }

    @GetMapping("/{messageId}/history")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    fun getMessageHistoryById(@PathVariable messageId: Long): List<MessageHistoryDTO> {
        return messageService.getMessageHistoryById(messageId)
    }
}
