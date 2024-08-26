package it.polito.document_store.dtos

import it.polito.document_store.entities.DocumentMetadata
import it.polito.document_store.utils.DocumentCategory
import java.time.LocalDateTime

data class DocumentMetadataDTO(
    val metadataId: Long,
    val name: String,
    val size: Long,
    val contentType: String,
    val timestamp: LocalDateTime,
    val category: DocumentCategory,
    /**
     * This value assumes different meaning based on the value of `category` field.
     * If the value of `category` field is equal to `Curriculum` the id is related to
     * a `professional` entity on the `crm microservice`.
     * */
    val id: Long? = null
)

fun DocumentMetadata.toDto(): DocumentMetadataDTO =
    DocumentMetadataDTO(this.metadataId, this.name, this.size, this.contentType, this.timestamp, this.category, this.id)
