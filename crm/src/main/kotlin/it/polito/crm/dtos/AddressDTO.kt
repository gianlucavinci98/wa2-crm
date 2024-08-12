package it.polito.crm.dtos

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

data class AddressDTO(
    @field:Min(
        value = 0, message = "Invalid addressId, it must be equal or greater than 0"
    )
    val addressId: Long?,
    @field:NotBlank(message = "Invalid address, it must not be blank")
    val address: String
)