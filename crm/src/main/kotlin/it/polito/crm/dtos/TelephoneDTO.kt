package it.polito.crm.dtos

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Pattern

data class TelephoneDTO(
    @field:Min(
        value = 0, message = "Invalid telephoneId, it must be equal or greater than 0"
    )
    val telephoneId: Long?,
    @field:Pattern(
        regexp = "^\\+?[0-9]{1,3}[ -]?[0-9]{3,}$",
        message = "Invalid telephone format"
    )
    val telephoneNumber: String
)