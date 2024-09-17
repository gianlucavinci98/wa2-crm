package it.polito.document_store.services


import it.polito.document_store.dtos.DocumentDTO
import it.polito.document_store.dtos.DocumentDataDTO
import it.polito.document_store.dtos.DocumentMetadataDTO
import it.polito.document_store.dtos.toDto
import it.polito.document_store.entities.DocumentData
import it.polito.document_store.entities.DocumentMetadata
import it.polito.document_store.repositories.DocumentMetadataRepository
import it.polito.document_store.utils.*
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Predicate
import jakarta.persistence.criteria.Root
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrElse

@Service
class DocumentServiceImpl(
    private val entityManager: EntityManager,
    private val documentMetadataRepository: DocumentMetadataRepository,
) : DocumentService {
    private val logger = LoggerFactory.getLogger(DocumentServiceImpl::class.java)

    @Transactional
    override fun insertNewDocument(newDocument: DocumentDTO): DocumentMetadataDTO {
        if (documentMetadataRepository.findByName(newDocument.name).isNotEmpty()) {
            throw DuplicateDocumentException("Document with the same name already exists")
        }

        val documentMetadata = DocumentMetadata()
        val documentData = DocumentData()

        try {
            documentMetadata.name = newDocument.name
            documentMetadata.size = newDocument.size
            documentMetadata.contentType = newDocument.contentType
            documentMetadata.timestamp = LocalDateTime.now()
            documentMetadata.category = newDocument.category
            documentMetadata.id = newDocument.id
            documentData.data = newDocument.data.toByteArray()
            documentData.documentMetadata = documentMetadata
            documentMetadata.documentData = documentData
        } catch (e: RuntimeException) {
            throw DocumentProcessingException("Error encountered while processing document", e)
        }

        logger.info("Starting insert DocumentMetadata (with DocumentData) into database")
        val newDocumentMetadata = documentMetadataRepository.save(documentMetadata)
        logger.info("Correctly inserted: $newDocumentMetadata")

        return newDocumentMetadata.toDto()
    }

    @Transactional
    override fun updateDocument(id: Long, newDocument: DocumentDTO): DocumentMetadataDTO {
        val documentMetadata = documentMetadataRepository.findById(id).getOrElse {
            throw DocumentNotFoundException("Document not found")
        }

        if (documentMetadataRepository.findByName(newDocument.name).any { it.metadataId != id }) {
            throw DuplicateDocumentException("Document with the same name already exists")
        }

        logger.info("Starting to update DocumentMetadata (with DocumentData) into database:  $documentMetadata")

        try {
            documentMetadata.metadataId = id
            documentMetadata.name = newDocument.name
            documentMetadata.size = newDocument.size
            documentMetadata.contentType = newDocument.contentType
            documentMetadata.timestamp = LocalDateTime.now()
            documentMetadata.category = newDocument.category
            documentMetadata.id = newDocument.id
            documentMetadata.documentData.data = newDocument.data.toByteArray()
        } catch (e: RuntimeException) {
            throw DocumentProcessingException("Error encountered while processing document", e)
        }

        val updatedDocumentMetadata = documentMetadataRepository.save(documentMetadata)

        logger.info("Update successful, new DocumentMetadata: $updatedDocumentMetadata")

        return updatedDocumentMetadata.toDto()
    }

    @Transactional
    override fun deleteDocument(id: Long) {
        if (documentMetadataRepository.existsById(id)) {
            logger.info("Starting to delete DocumentMetadata (with DocumentData) with id: $id")

            documentMetadataRepository.deleteById(id)

            logger.info("Successfully deleted DocumentMetadata (and related DocumentData) with id: $id")
        } else {
            throw DocumentNotFoundException("Document not found")
        }
    }

    override fun getDocuments(
        pageNumber: Int,
        pageSize: Int,
        category: DocumentCategory?,
        id: Long?
    ): List<DocumentMetadataDTO> {
        val cb: CriteriaBuilder = entityManager.criteriaBuilder

        val cqDocumentMetadata: CriteriaQuery<DocumentMetadata> = cb.createQuery(DocumentMetadata::class.java)
        val rootDocumentMetadata: Root<DocumentMetadata> = cqDocumentMetadata.from(DocumentMetadata::class.java)

        val predicates = mutableListOf<Predicate>()

        if (category != null) {
            predicates.add(cb.equal(rootDocumentMetadata.get<String>("category"), category))
        }

        if (id != null) {
            predicates.add(cb.equal(rootDocumentMetadata.get<String>("id"), id))
        }

        cqDocumentMetadata.where(*predicates.toTypedArray())

        val query = entityManager.createQuery(cqDocumentMetadata)
        query.firstResult = pageNumber * pageSize
        query.maxResults = pageSize

        return query.resultList.map { it.toDto() }
    }

    override fun getDocumentMetadataById(id: Long): DocumentMetadataDTO {
        return documentMetadataRepository.findById(id).map { it.toDto() }
            .orElseThrow { throw DocumentNotFoundException("Document not found") }
    }

    override fun getDocumentDataById(id: Long): DocumentDataDTO {
        val documentMetadata = documentMetadataRepository.findById(id)
            .orElseThrow { throw DocumentNotFoundException("Document not found") }
        return documentMetadata.documentData.toDto()
    }
}