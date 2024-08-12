package it.polito.document_store.dtos

import it.polito.document_store.entities.DocumentMetadata
import java.time.LocalDateTime

data class DocumentMetadataDTO(
    val metadataId: Long,
    val name: String,
    val size: Long,
    val contentType: String,
    val timestamp: LocalDateTime
)

fun DocumentMetadata.toDto(): DocumentMetadataDTO =
    DocumentMetadataDTO(this.metadataId, this.name, this.size, this.contentType, this.timestamp)
