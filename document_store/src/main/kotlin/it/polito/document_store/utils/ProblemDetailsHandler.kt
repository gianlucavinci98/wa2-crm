package it.polito.document_store.utils

import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.multipart.MultipartException
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@RestControllerAdvice
class ProblemDetailsHandler : ResponseEntityExceptionHandler() {
    @ExceptionHandler(DocumentNotFoundException::class)
    fun handleDocumentNotFound(e: DocumentNotFoundException): ResponseEntity<ProblemDetail> {
        val problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "Document not found")
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail)
    }

    @ExceptionHandler(DuplicateDocumentException::class)
    fun handleDuplicateDocument(e: DuplicateDocumentException): ResponseEntity<ProblemDetail> {
        val problemDetail =
            ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                e.message ?: "Document with the same name already exists"
            )
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problemDetail)
    }

    @ExceptionHandler(MissingServletRequestParameterException::class)
    fun handleMissingRequestParam(e: MissingServletRequestParameterException): ResponseEntity<ProblemDetail> {
        val problemDetail =
            ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.message ?: "Missing request parameter")
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

    @ExceptionHandler(DocumentProcessingException::class)
    fun handleDocumentProcessingException(e: DocumentProcessingException): ResponseEntity<ProblemDetail> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR,
            e.message ?: "Error encountered while processing document"
        )
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problemDetail)
    }

    @ExceptionHandler(InvalidFileException::class)
    fun handleInvalidFileException(e: InvalidFileException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "The file or its name were not provided or are empty"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

    @ExceptionHandler(MultipartException::class)
    fun handleMultipartException(e: MultipartException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "Invalid request. Please make sure the request is multipart/form-data."
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }
}

class DocumentNotFoundException(message: String?) : RuntimeException(message)

class DuplicateDocumentException(message: String?) : RuntimeException(message)

class MissingServletRequestParameterException(message: String?) : RuntimeException(message)

class InvalidFileException(message: String?) : RuntimeException(message)
class DocumentProcessingException(message: String?, cause: Throwable? = null) : RuntimeException(message, cause)
