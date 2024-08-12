package it.polito.crm.dtos

import it.polito.crm.utils.Category
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

data class ContactDetailsDTO(
    @field:Min(
        value = 0, message = "Invalid contactId, it must be equal or greater than 0"
    )
    val contactId: Long,
    @field:NotBlank(message = "Invalid name, it must not be blank")
    val name: String,
    @field:NotBlank(message = "Invalid surname, it must not be blank")
    val surname: String,
    @field:NotBlank(message = "Invalid ssn, it must not be blank")
    val ssn: String,
    val category: Category,
    val addresses: Set<AddressDTO>,
    val emails: Set<EmailDTO>,
    val telephones: Set<TelephoneDTO>
)
