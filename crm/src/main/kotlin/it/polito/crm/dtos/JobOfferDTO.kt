package it.polito.crm.dtos

import it.polito.crm.utils.JobOfferStatus
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty

data class JobOfferDTO(
    @field:Min(
        value = 0, message = "Invalid jobOfferId, it must be equal or greater than 0"
    )
    val jobOfferId: Long?,
    @field:NotBlank(message = "Invalid description, it must not be blank")
    val description: String,
    val details: String?,
    val status: JobOfferStatus?,
    @field:NotEmpty(message = "Invalid required skills, they must not be empty")
    val requiredSkills: MutableSet<String>,
    val duration: Long,
    val value: Float?,
    val professionalId: Long?
)

