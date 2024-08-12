package it.polito.crm.dtos

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Pattern

data class EmailDTO(
    @field:Min(
        value = 0, message = "Invalid emailId, it must be equal or greater than 0"
    )
    val emailId: Long?,
    @field:Pattern(
        regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$",
        message = "Invalid email format"
    )
    val emailAddress: String
)