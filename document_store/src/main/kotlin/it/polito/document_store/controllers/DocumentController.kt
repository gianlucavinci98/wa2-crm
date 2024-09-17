package it.polito.document_store.controllers

import it.polito.document_store.dtos.DocumentDTO
import it.polito.document_store.dtos.DocumentMetadataDTO
import it.polito.document_store.services.DocumentService
import it.polito.document_store.utils.DocumentCategory
import it.polito.document_store.utils.DocumentNotFoundException
import jakarta.validation.constraints.Min
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/documents")
class DocumentController(private val documentService: DocumentService) {
    @PostMapping("", "/")
    @ResponseStatus(code = HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    fun insertNewDocument(@RequestBody newDocument: DocumentDTO): DocumentMetadataDTO {
        return documentService.insertNewDocument(newDocument)
    }

    @PutMapping("/{metadataId}")
    @PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    fun updateDocument(
        @PathVariable("metadataId") metadataId: Long,
        @RequestBody newDocument: DocumentDTO
    ): DocumentMetadataDTO {
        return documentService.updateDocument(metadataId, newDocument)
    }

    @DeleteMapping("/{metadataId}")
    @PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    fun deleteDocument(@PathVariable("metadataId") metadataId: Long) {
        documentService.deleteDocument(metadataId)
    }

    @GetMapping("", "/")
    @PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    fun getDocuments(
        @RequestParam("pageNumber", required = false) @Min(
            value = 0,
            message = "Page number not valid, value must be great or equal to 0"
        ) pageNumber: Int = 0,
        @RequestParam("pageSize", required = false) @Min(
            value = 1,
            message = "Page size not valid, value must be great or equal to 1"
        ) pageSize: Int = 20,
        @RequestParam(
            "category", required = false
        ) category: DocumentCategory?,
        @RequestParam(
            "id", required = false
        ) id: Long?
    ): List<DocumentMetadataDTO> {
        return documentService.getDocuments(pageNumber, pageSize, category, id)
    }

    @GetMapping("/{metadataId}")
    @PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    fun getDocumentMetadataById(@PathVariable("metadataId") metadataId: Long): DocumentMetadataDTO {
        return documentService.getDocumentMetadataById(metadataId)
    }

    @GetMapping("/{metadataId}/data")
    @PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    fun getDocumentDataById(@PathVariable("metadataId") metadataId: Long): ResponseEntity<ByteArray> {
        try {
            val documentMetadataDTO = documentService.getDocumentMetadataById(metadataId)
            val documentDataDTO = documentService.getDocumentDataById(metadataId)

            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${documentMetadataDTO.name}\"")
                .contentType(MediaType.parseMediaType(documentMetadataDTO.contentType))
                .body(Base64.getDecoder().decode(documentDataDTO.data))
        } catch (e: DocumentNotFoundException) {
            throw DocumentNotFoundException("Document data not found")
        }
    }
}