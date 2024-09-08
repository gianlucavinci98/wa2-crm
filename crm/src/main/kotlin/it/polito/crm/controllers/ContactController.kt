package it.polito.crm.controllers

import it.polito.crm.dtos.*
import it.polito.crm.services.ContactService
import it.polito.crm.utils.Category
import jakarta.validation.Valid
import jakarta.validation.constraints.Min
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/contacts")
class ContactController(private val contactService: ContactService) {
    @GetMapping("", "/")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_guest', 'ROLE_manager')")
    fun getAllContacts(
        @RequestParam("pageNumber", required = false) @Min(
            value = 0,
            message = "Page number not valid, value must be great or equal to 0"
        ) pageNumber: Int = 0,
        @RequestParam("pageSize", required = false) @Min(
            value = 1,
            message = "Page size not valid, value must be great or equal to 1"
        ) pageSize: Int = 20,
        @RequestParam("name", required = false) name: String?,
        @RequestParam("surname", required = false) surname: String?,
        @RequestParam("ssn", required = false) ssn: String?,
        @RequestParam("category", required = false) category: Category?,
        @RequestParam("address", required = false) address: String?,
        @RequestParam("emailAddress", required = false) emailAddress: String?,
        @RequestParam("telephoneNumber", required = false) telephoneNumber: String?,
        auth: Authentication?
    ): ResponseEntity<List<ContactDTO>> {
        println("Name: " + auth?.name)
        println("Details: " + auth?.details)
        println("Credential: " + auth?.credentials)
        println("Autenticato? " + auth?.isAuthenticated)
        println("Authorities: " + auth?.authorities)
        val jwt = auth?.principal as? Jwt
        println("Claims: " + jwt?.claims)
        println("JWT: ${jwt?.tokenValue ?: "Auth is null or not JWT"}")

        val contacts = contactService.getAllContacts(
            pageNumber,
            pageSize,
            name,
            surname,
            ssn,
            category,
            address,
            emailAddress,
            telephoneNumber
        )

        return ResponseEntity.ok(contacts)
    }

    @GetMapping("/{contactId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_guest', 'ROLE_manager')")
    fun getContactById(@PathVariable contactId: Long): ResponseEntity<ContactDetailsDTO> {
        val contact = contactService.getContactById(contactId)
        return ResponseEntity.ok(contact)
    }

    @PostMapping("", "/")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun insertNewContact(@Valid @RequestBody contactDTO: ContactDTO): ResponseEntity<ContactDTO> {
        val createdContact = contactService.insertNewContact(contactDTO)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdContact)
    }

    @PutMapping("/{contactId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun updateContact(
        @PathVariable contactId: Long,
        @Valid @RequestBody newContact: ContactDTO
    ): ResponseEntity<ContactDTO> {
        val updatedContact = contactService.updateContact(contactId, newContact)
        return ResponseEntity.ok(updatedContact)
    }

    @DeleteMapping("/{contactId}")
    @PreAuthorize("hasAnyRole('ROLE_manager')")
    fun deleteContact(
        @PathVariable contactId: Long
    ): ResponseEntity<Unit> {
        contactService.deleteContact(contactId)
        return ResponseEntity.noContent().build()
    }

    /* Insert */

    @PostMapping("/{contactId}/address")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun addAddressToContact(
        @PathVariable contactId: Long,
        @Valid @RequestBody address: AddressDTO
    ): ResponseEntity<ContactDetailsDTO> {
        val updatedContact = contactService.addAddressToContact(contactId, address)
        return ResponseEntity.ok(updatedContact)
    }

    @PostMapping("/{contactId}/email")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun addEmailToContact(
        @PathVariable contactId: Long,
        @Valid @RequestBody email: EmailDTO
    ): ResponseEntity<ContactDetailsDTO> {
        val updatedContact = contactService.addEmailToContact(contactId, email)
        return ResponseEntity.ok(updatedContact)
    }

    @PostMapping("/{contactId}/telephone")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun addTelephoneToContact(
        @PathVariable contactId: Long,
        @Valid @RequestBody telephone: TelephoneDTO
    ): ResponseEntity<ContactDetailsDTO> {
        val updatedContact = contactService.addTelephoneToContact(contactId, telephone)
        return ResponseEntity.ok(updatedContact)
    }

    /* Update */

    @PutMapping("/{contactId}/address/{addressId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun updateAddressOfContact(
        @PathVariable contactId: Long,
        @PathVariable addressId: Long,
        @Valid @RequestBody newAddress: AddressDTO
    ): ResponseEntity<ContactDetailsDTO> {
        val updatedContact = contactService.updateAddressOfContact(contactId, addressId, newAddress)
        return ResponseEntity.ok(updatedContact)
    }

    @PutMapping("/{contactId}/email/{emailId}")
    @PreAuthorize("hasAnyRole('ROLE_operator','ROLE_manager')")
    fun updateEmailOfContact(
        @PathVariable contactId: Long,
        @PathVariable emailId: Long,
        @Valid @RequestBody newEmail: EmailDTO
    ): ResponseEntity<ContactDetailsDTO> {
        val updatedContact = contactService.updateEmailOfContact(contactId, emailId, newEmail)
        return ResponseEntity.ok(updatedContact)
    }

    @PutMapping("/{contactId}/telephone/{telephoneId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun updateTelephoneOfContact(
        @PathVariable contactId: Long,
        @PathVariable telephoneId: Long,
        @Valid @RequestBody newTelephone: TelephoneDTO
    ): ResponseEntity<ContactDetailsDTO> {
        val updatedContact = contactService.updateTelephoneOfContact(contactId, telephoneId, newTelephone)
        return ResponseEntity.ok(updatedContact)
    }

    /* Delete */

    @DeleteMapping("/{contactId}/address/{addressId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun deleteAddressFromContact(
        @PathVariable contactId: Long,
        @PathVariable addressId: Long
    ): ResponseEntity<Unit> {
        contactService.deleteAddressFromContact(contactId, addressId)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/{contactId}/email/{emailId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun deleteEmailFromContact(
        @PathVariable contactId: Long,
        @PathVariable emailId: Long
    ): ResponseEntity<Unit> {
        contactService.deleteEmailFromContact(contactId, emailId)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/{contactId}/telephone/{telephoneId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun deleteTelephoneFromContact(
        @PathVariable contactId: Long,
        @PathVariable telephoneId: Long
    ): ResponseEntity<Unit> {
        contactService.deleteTelephoneFromContact(contactId, telephoneId)
        return ResponseEntity.noContent().build()
    }
}
