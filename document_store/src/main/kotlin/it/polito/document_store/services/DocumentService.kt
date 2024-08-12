package it.polito.document_store.services

import it.polito.document_store.dtos.DocumentDataDTO
import it.polito.document_store.dtos.DocumentMetadataDTO
import org.springframework.web.multipart.MultipartFile

interface DocumentService {
    fun insertNewDocument(file: MultipartFile): DocumentMetadataDTO

    fun updateDocument(id: Long, file: MultipartFile): DocumentMetadataDTO

    fun deleteDocument(id: Long)

    fun getDocuments(pageNumber: Int, pageSize: Int): List<DocumentMetadataDTO>

    fun getDocumentMetadataById(id: Long): DocumentMetadataDTO

    fun getDocumentDataById(id: Long): DocumentDataDTO
}