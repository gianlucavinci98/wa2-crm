package it.polito.document_store

import io.mockk.*
import it.polito.document_store.entities.DocumentData
import it.polito.document_store.entities.DocumentMetadata
import it.polito.document_store.repositories.DocumentMetadataRepository
import it.polito.document_store.services.DocumentServiceImpl
import it.polito.document_store.utils.DocumentNotFoundException
import it.polito.document_store.utils.DuplicateDocumentException
import it.polito.document_store.utils.InvalidFileException
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.mock.web.MockMultipartFile
import java.time.LocalDateTime
import java.util.*

class DocumentServiceTest {
    val repo = mockk<DocumentMetadataRepository>()
    val service = DocumentServiceImpl(repo)

    @Test
    fun `test get document metadata by id`() {
        //Arrange
        every { repo.findById(1) } returns Optional.of(DocumentMetadata().apply {
            metadataId = 1L
            name = "test.xml"
            size = 18
            contentType = "application/xml"
            timestamp = LocalDateTime.of(2012, 12, 12, 12, 12)
        })

        //Act
        val dto = service.getDocumentMetadataById(1)

        //Assert
        assertEquals(dto.metadataId, 1L)
        assertEquals(dto.name, "test.xml")
        assertEquals(dto.size, 18)
        assertEquals(dto.contentType, "application/xml")
        assertEquals(dto.timestamp, LocalDateTime.of(2012, 12, 12, 12, 12))
    }

    @Test
    fun `test get document data by id`() {
        // Arrange
        val id = 1L
        val mockDocumentMetadata = DocumentMetadata().apply {
            metadataId = id
            name = "test.xml"
            size = 18
            contentType = "application/xml"
            timestamp = LocalDateTime.of(2012, 12, 12, 12, 12)
            documentData = DocumentData().apply {
                documentId = id
                data = "Test document data".toByteArray()
            }
        }
        val repo = mockk<DocumentMetadataRepository> {
            every { findById(id) } returns Optional.of(mockDocumentMetadata)
        }
        val service = DocumentServiceImpl(repo)

        // Act
        val dto = service.getDocumentDataById(id)

        // Assert
        assertEquals(dto.documentId, id)
        assertArrayEquals(dto.data, "Test document data".toByteArray())
    }

    @Test
    fun `test get documents with pagination`() {
        // Arrange
        val pageNumber = 0
        val pageSize = 10
        val mockPage: Page<DocumentMetadata> = mockk()
        val mockDocumentMetadataList: List<DocumentMetadata> = listOf(
            DocumentMetadata().apply {
                metadataId = 1L
                name = "test1.xml"
                size = 18
                contentType = "application/xml"
                timestamp = LocalDateTime.of(2012, 12, 12, 12, 12)
            },
            DocumentMetadata().apply {
                metadataId = 2L
                name = "test2.xml"
                size = 18
                contentType = "application/xml"
                timestamp = LocalDateTime.of(2012, 12, 12, 12, 12)
            }
        )
        every { repo.findAll(PageRequest.of(pageNumber, pageSize)) } returns mockPage
        every { mockPage.toList() } returns mockDocumentMetadataList

        val service = DocumentServiceImpl(repo)

        // Act
        val result = service.getDocuments(pageNumber, pageSize)

        // Assert
        assertEquals(2, result.size)
        assertEquals(1L, result[0].metadataId)
        assertEquals("test1.xml", result[0].name)
        assertEquals(18, result[0].size)
        assertEquals("application/xml", result[0].contentType)
        assertEquals(LocalDateTime.of(2012, 12, 12, 12, 12), result[0].timestamp)

        assertEquals(2L, result[1].metadataId)
        assertEquals("test2.xml", result[1].name)
        assertEquals(18, result[1].size)
        assertEquals("application/xml", result[1].contentType)
        assertEquals(LocalDateTime.of(2012, 12, 12, 12, 12), result[1].timestamp)
    }

    @Test
    fun `test delete a document`() {
        // Arrange
        val id = 1L
        every { repo.existsById(id) } returns true
        every { repo.deleteById(id) } just Runs

        // Act & Assert
        assertDoesNotThrow { service.deleteDocument(id) }
        verify(exactly = 1) { repo.existsById(id) }
        verify(exactly = 1) { repo.deleteById(id) }
    }

    @Test
    fun `test delete a non-existing document should throw DocumentNotFoundException`() {
        // Arrange
        val id = 1L
        every { repo.existsById(id) } returns false

        // Act & Assert
        assertThrows<DocumentNotFoundException> { service.deleteDocument(id) }
        verify(exactly = 1) { repo.existsById(id) }
        verify(exactly = 0) { repo.deleteById(id) }
    }

    @Test
    fun `test update document`() {
        // Arrange
        val id = 1L
        val fileName = "test.xml"
        val fileSize = 18L
        val fileContentType = "application/xml"
        val fileBytes = "Test document data".toByteArray()
        val file = MockMultipartFile(fileName, fileName, fileContentType, fileBytes)
        val mockDocumentMetadata = DocumentMetadata().apply {
            metadataId = id
            name = "old_test.xml"
            size = 18
            contentType = "application/xml"
            timestamp = LocalDateTime.now().minusDays(1)
            documentData = DocumentData().apply {
                documentId = id
                data = "Old document data".toByteArray()
            }
        }
        every { repo.findById(id) } returns Optional.of(mockDocumentMetadata)
        every { repo.findByName(fileName) } returns emptyList() // Mocking for empty list
        every { repo.save(any()) } answers { firstArg() }

        // Act
        val result = service.updateDocument(id, file)

        // Assert
        assertEquals(id, result.metadataId)
        assertEquals(fileName, result.name)
        assertEquals(fileSize, result.size)
        assertEquals(fileContentType, result.contentType)
        assertNotNull(result.timestamp)

        verify(exactly = 1) { repo.findById(id) }
        verify(exactly = 1) { repo.findByName(fileName) }
        verify(exactly = 1) { repo.save(any()) }
    }

    @Test
    fun `test update document with empty file should throw InvalidFileException`() {
        // Arrange
        val id = 1L
        val emptyFile = MockMultipartFile("empty_file", byteArrayOf())

        // Act & Assert
        assertThrows<InvalidFileException> { service.updateDocument(id, emptyFile) }
        verify(exactly = 0) { repo.findById(any()) }
        verify(exactly = 0) { repo.save(any()) }
    }

    @Test
    fun `test update document with duplicate name should throw DuplicateDocumentException`() {
        // Arrange
        val id = 1L
        val fileName = "test.xml"
        val file = MockMultipartFile(fileName, fileName, "application/xml", "Test document data".toByteArray())
        val mockDocumentMetadataList: List<DocumentMetadata> = listOf(
            DocumentMetadata().apply {
                metadataId = 2L
                name = fileName
            }
        )
        every { repo.findById(id) } returns Optional.of(DocumentMetadata())
        every { repo.findByName(fileName) } returns mockDocumentMetadataList

        // Act & Assert
        assertThrows<DuplicateDocumentException> { service.updateDocument(id, file) }
        verify(exactly = 0) { repo.save(any()) }
    }

    @Test
    fun `test update non-existing document should throw DocumentNotFoundException`() {
        // Arrange
        val id = 1L
        val fileName = "test.xml"
        val file = MockMultipartFile(fileName, fileName, "application/xml", "Test document data".toByteArray())
        every { repo.findById(id) } returns Optional.empty()

        // Act & Assert
        assertThrows<DocumentNotFoundException> { service.updateDocument(id, file) }
        verify(exactly = 0) { repo.save(any()) }
    }

    @Test
    fun `test insert new document`() {
        // Arrange
        val fileName = "test.xml"
        val fileSize = 18L
        val fileContentType = "application/xml"
        val fileBytes = "Test document data".toByteArray()
        val file = MockMultipartFile(fileName, fileName, fileContentType, fileBytes)
        every { repo.findByName(fileName) } returns emptyList() // Mocking for an empty list
        every { repo.save(any()) } answers { firstArg() }

        // Act
        val result = service.insertNewDocument(file)

        // Assert
        assertNotNull(result.metadataId)
        assertEquals(fileName, result.name)
        assertEquals(fileSize, result.size)
        assertEquals(fileContentType, result.contentType)
        assertNotNull(result.timestamp)

        verify(exactly = 1) { repo.findByName(fileName) }
        verify(exactly = 1) { repo.save(any()) }
    }

    @Test
    fun `test insert new document with empty file should throw InvalidFileException`() {
        // Arrange
        val emptyFile = MockMultipartFile("empty_file", byteArrayOf())

        // Act & Assert
        assertThrows<InvalidFileException> { service.insertNewDocument(emptyFile) }
        verify(exactly = 0) { repo.findByName(any()) }
        verify(exactly = 0) { repo.save(any()) }
    }

    @Test
    fun `test insert new document with duplicate name should throw DuplicateDocumentException`() {
        // Arrange
        val fileName = "test.xml"
        val file = MockMultipartFile(fileName, fileName, "application/xml", "Test document data".toByteArray())
        val mockDocumentMetadataList: List<DocumentMetadata> = listOf(
            DocumentMetadata().apply {
                metadataId = 2L
                name = fileName
            }
        )
        every { repo.findByName(fileName) } returns mockDocumentMetadataList

        // Act & Assert
        assertThrows<DuplicateDocumentException> { service.insertNewDocument(file) }
        verify(exactly = 1) { repo.findByName(fileName) }
        verify(exactly = 0) { repo.save(any()) }
    }
}
