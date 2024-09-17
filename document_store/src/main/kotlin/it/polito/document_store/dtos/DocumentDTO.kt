package it.polito.document_store.dtos

import it.polito.document_store.utils.DocumentCategory
import java.time.LocalDateTime

data class DocumentDTO(
    val name: String,
    val size: Long,
    val contentType: String,
    val category: DocumentCategory,
    /**
     * This value assumes different meaning based on the value of `category` field.
     * If the value of `category` field is equal to `Curriculum` the id is related to
     * a `professional` entity on the `crm microservice`.
     * */
    val id: Long? = null,
    val data: String
)