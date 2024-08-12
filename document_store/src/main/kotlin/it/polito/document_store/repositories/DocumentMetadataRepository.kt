package it.polito.document_store.repositories

import it.polito.document_store.entities.DocumentMetadata
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.stereotype.Repository

@Repository
interface DocumentMetadataRepository : JpaRepository<DocumentMetadata, Long>,
    PagingAndSortingRepository<DocumentMetadata, Long> {
    fun findByName(name: String): List<DocumentMetadata>
}