package it.polito.crm.utils

import com.fasterxml.jackson.databind.exc.InvalidFormatException
import com.fasterxml.jackson.databind.exc.MismatchedInputException
import org.springframework.http.*
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import java.security.InvalidParameterException

data class ValidationErrorResponse(val errors: List<ValidationError>)
data class ValidationError(val field: String, val message: String)

@ControllerAdvice
class GlobalValidationExceptionHandler : ResponseEntityExceptionHandler() {
    override fun handleMethodArgumentNotValid(
        ex: MethodArgumentNotValidException,
        headers: HttpHeaders,
        status: HttpStatusCode,
        request: WebRequest
    ): ResponseEntity<Any>? {
        val errors = ex.bindingResult.allErrors.map { error ->
            val field = (error as FieldError).field
            val message = error.defaultMessage ?: "Invalid value"
            ValidationError(field, message)
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors)
    }

    override fun handleHttpMessageNotReadable(
        ex: HttpMessageNotReadableException,
        headers: HttpHeaders,
        status: HttpStatusCode,
        request: WebRequest
    ): ResponseEntity<Any> {
        val errors = when (val cause = ex.cause) {
            is InvalidFormatException -> cause.path.map { reference ->
                ValidationError(reference.fieldName, "Invalid value")
            }

            is MismatchedInputException -> cause.path.map { reference ->
                ValidationError(reference.fieldName, "Invalid ${reference.fieldName}, it must not be null")
            }

            else -> listOf(ValidationError("body", "Malformed JSON request"))
        }
        val errorResponse = ValidationErrorResponse(errors)
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
    }
}

@RestControllerAdvice
class ProblemDetailsHandler : ResponseEntityExceptionHandler() {
    @ExceptionHandler(ContactNotFoundException::class)
    fun handleContactNotFound(e: ContactNotFoundException): ResponseEntity<ProblemDetail> {
        val problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "Contact not found")
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail)
    }

    @ExceptionHandler(ProfessionalNotFoundException::class)
    fun handleProfessionalNotFound(e: ProfessionalNotFoundException): ResponseEntity<ProblemDetail> {
        val problemDetail =
            ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "Professional not found")
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail)
    }

    @ExceptionHandler(JobOfferNotFoundException::class)
    fun handleJobOfferNotFound(e: JobOfferNotFoundException): ResponseEntity<ProblemDetail> {
        val problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "Job offer not found")
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail)
    }

    @ExceptionHandler(CustomerNotFoundException::class)
    fun handleCustomerNotFound(e: CustomerNotFoundException): ResponseEntity<ProblemDetail> {
        val problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "Customer not found")
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail)
    }

    @ExceptionHandler(MessageNotFoundException::class)
    fun handleMessageNotFound(e: ContactNotFoundException): ResponseEntity<ProblemDetail> {
        val problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "Message not found")
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail)
    }

    @ExceptionHandler(EmailNotFoundException::class)
    fun handleEmailNotFound(e: EmailNotFoundException): ResponseEntity<ProblemDetail> {
        val problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "Email not found")
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail)
    }

    @ExceptionHandler(TelephoneNotFoundException::class)
    fun handleTelephoneNotFound(e: TelephoneNotFoundException): ResponseEntity<ProblemDetail> {
        val problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "Telephone not found")
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail)
    }

    @ExceptionHandler(AddressNotFoundException::class)
    fun handleAddressNotFound(e: AddressNotFoundException): ResponseEntity<ProblemDetail> {
        val problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message ?: "Address not found")
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail)
    }

    @ExceptionHandler(MissingServletRequestParameterException::class)
    fun handleMissingRequestParam(e: MissingServletRequestParameterException): ResponseEntity<ProblemDetail> {
        val problemDetail =
            ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.message ?: "Missing request parameter")
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

    @ExceptionHandler(AddressConflictException::class)
    fun handleAddressConflictException(e: AddressConflictException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.CONFLICT,
            e.message ?: "The provided address is already assigned to this contact"
        )
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problemDetail)
    }

    @ExceptionHandler(EmailConflictException::class)
    fun handleEmailConflictException(e: EmailConflictException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.CONFLICT,
            e.message ?: "The provided email address is already assigned to this contact"
        )
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problemDetail)
    }

    @ExceptionHandler(TelephoneConflictException::class)
    fun handleTelephoneConflictException(e: TelephoneConflictException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.CONFLICT,
            e.message ?: "The provided telephone number is already assigned to this contact"
        )
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problemDetail)
    }

    @ExceptionHandler(InvalidParameterException::class)
    fun handleInvalidParameterException(e: InvalidParameterException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "It is not possible to update the contact information"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

    @ExceptionHandler(MessageStatusException::class)
    fun handleMessageStatusException(e: MessageStatusException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR,
            e.message ?: "It is not possible to switch from the current state to the next one"
        )
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problemDetail)
    }

    @ExceptionHandler(JobOfferStatusException::class)
    fun handleJobOfferStatusException(e: JobOfferStatusException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR,
            e.message ?: "It is not possible to switch from the current state to the inserted one"
        )
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problemDetail)
    }

    @ExceptionHandler(MessageSenderChannelCoherence::class)
    fun handleMessageSenderChannelCoherence(e: MessageSenderChannelCoherence): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "The sender value is not coherent with the channel type"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

    @ExceptionHandler(ParameterNotValidException::class)
    fun handleParameterNotValidException(e: ParameterNotValidException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "The provided parameter is not valid"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

    @ExceptionHandler(JobOfferProcessingException::class)
    fun handleJobOfferUpdateStatusIllegalParameter(e: JobOfferProcessingException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "Bad Request"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

    @ExceptionHandler(CustomerConflictException::class)
    fun handleCustomerConflictException(e: CustomerConflictException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.CONFLICT,
            e.message ?: "The contact ID is already associated with a customer profile"
        )
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problemDetail)
    }

    @ExceptionHandler(ProfessionalConflictException::class)
    fun handleProfessionalConflictException(e: ProfessionalConflictException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.CONFLICT,
            e.message ?: "The contact ID is already associated with a professional profile"
        )
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problemDetail)
    }

    @ExceptionHandler(CustomerProcessingException::class)
    fun handleCustomerProcessingException(e: CustomerProcessingException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "Bad request"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

    @ExceptionHandler(ProfessionalProcessingException::class)
    fun handleProfessionalProcessingException(e: ProfessionalProcessingException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "Bad request"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

    @ExceptionHandler(ContactProcessingException::class)
    fun handleContactProcessingException(e: ContactProcessingException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "Bad request"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }
}

class ContactNotFoundException(message: String?) : RuntimeException(message)
class MessageNotFoundException(message: String?) : RuntimeException(message)
class EmailNotFoundException(message: String?) : RuntimeException(message)
class TelephoneNotFoundException(message: String?) : RuntimeException(message)
class AddressNotFoundException(message: String?) : RuntimeException(message)
class CustomerNotFoundException(message: String?) : RuntimeException(message)
class JobOfferNotFoundException(message: String?) : RuntimeException(message)
class ProfessionalNotFoundException(message: String?) : RuntimeException(message)
class ParameterNotValidException(message: String?) : RuntimeException(message)
class AddressConflictException(message: String?) : RuntimeException(message)
class EmailConflictException(message: String?) : RuntimeException(message)
class TelephoneConflictException(message: String?) : RuntimeException(message)
class MessageStatusException(message: String?) : RuntimeException(message)
class JobOfferStatusException(message: String?) : RuntimeException(message)
class JobOfferProcessingException(message: String?) : RuntimeException(message)
class MissingServletRequestParameterException(message: String?) : RuntimeException(message)
class ContactProcessingException(message: String?) : RuntimeException(message)
class MessageProcessingException(message: String?) : RuntimeException(message)
class CustomerProcessingException(message: String?) : RuntimeException(message)
class ProfessionalProcessingException(message: String?) : RuntimeException(message)
class CustomerConflictException(message: String?) : RuntimeException(message)
class ProfessionalConflictException(message: String?) : RuntimeException(message)
class MessageSenderChannelCoherence(message: String?) : RuntimeException(message)