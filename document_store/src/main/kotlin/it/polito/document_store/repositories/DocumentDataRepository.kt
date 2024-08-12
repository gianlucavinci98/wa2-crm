package it.polito.document_store.repositories

import it.polito.document_store.entities.DocumentData
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DocumentDataRepository : JpaRepository<DocumentData, Long> {
}