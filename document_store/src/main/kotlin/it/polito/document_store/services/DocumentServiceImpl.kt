package it.polito.document_store.services


import it.polito.document_store.utils.DocumentNotFoundException
import it.polito.document_store.utils.DuplicateDocumentException
import it.polito.document_store.utils.DocumentProcessingException
import it.polito.document_store.utils.InvalidFileException
import it.polito.document_store.dtos.DocumentDataDTO
import it.polito.document_store.dtos.DocumentMetadataDTO
import it.polito.document_store.dtos.toDto
import it.polito.document_store.entities.DocumentData
import it.polito.document_store.entities.DocumentMetadata
import it.polito.document_store.repositories.DocumentMetadataRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrElse

@Service
class DocumentServiceImpl(
    private val documentMetadataRepository: DocumentMetadataRepository,
) : DocumentService {
    private val logger = LoggerFactory.getLogger(DocumentServiceImpl::class.java)

    @Transactional
    override fun insertNewDocument(file: MultipartFile): DocumentMetadataDTO {
        if (file.isEmpty || file.originalFilename?.isEmpty() == true) {
            throw InvalidFileException("The file or its name were not provided or are empty")
        }

        if (documentMetadataRepository.findByName(file.originalFilename!!).isNotEmpty()) {
            throw DuplicateDocumentException("Document with the same name already exists")
        }

        val documentMetadata = DocumentMetadata()
        val documentData = DocumentData()

        try {
            documentMetadata.name = file.originalFilename!!
            documentMetadata.size = file.size
            documentMetadata.contentType = file.contentType!!
            documentMetadata.timestamp = LocalDateTime.now()
            documentData.data = file.bytes
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
    override fun updateDocument(id: Long, file: MultipartFile): DocumentMetadataDTO {

        if (file.isEmpty || file.originalFilename?.isEmpty() == true) {
            throw InvalidFileException("The file or its name were not provided or are empty")
        }

        val documentMetadata = documentMetadataRepository.findById(id).getOrElse {
            throw DocumentNotFoundException("Document not found")
        }

        if (documentMetadataRepository.findByName(file.originalFilename!!).any { it.metadataId != id }) {
            throw DuplicateDocumentException("Document with the same name already exists")
        }

        logger.info("Starting to update DocumentMetadata (with DocumentData) into database:  $documentMetadata")

        try {
            documentMetadata.metadataId = id
            documentMetadata.name = file.originalFilename!!
            documentMetadata.size = file.size
            documentMetadata.contentType = file.contentType!!
            documentMetadata.timestamp = LocalDateTime.now()
            documentMetadata.documentData.data = file.bytes
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

    override fun getDocuments(pageNumber: Int, pageSize: Int): List<DocumentMetadataDTO> {
        return documentMetadataRepository.findAll(PageRequest.of(pageNumber, pageSize)).toList()
            .map { it.toDto() }
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