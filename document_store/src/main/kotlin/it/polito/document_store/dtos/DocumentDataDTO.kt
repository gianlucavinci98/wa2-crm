package it.polito.document_store.dtos

import it.polito.document_store.entities.DocumentData

data class DocumentDataDTO(val documentId: Long, val data: ByteArray) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as DocumentDataDTO

        if (documentId != other.documentId) return false
        if (!data.contentEquals(other.data)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = documentId.hashCode()
        result = 31 * result + data.contentHashCode()
        return result
    }
}

fun DocumentData.toDto(): DocumentDataDTO =
    DocumentDataDTO(this.documentId, this.data)