package it.polito.crm.dtos

import it.polito.crm.entities.Contact
import jakarta.validation.constraints.Min

data class CustomerDTO(
    @field:Min(
        value = 0, message = "Invalid customerId, it must be equal or greater than 0"
    )
    val customerId: Long?,
    val notes: MutableSet<String>?,
    val contact: Contact?
)


