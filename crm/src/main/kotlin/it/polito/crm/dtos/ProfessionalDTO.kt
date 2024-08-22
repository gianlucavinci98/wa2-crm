package it.polito.crm.dtos

import it.polito.crm.entities.Contact
import it.polito.crm.utils.EmploymentState
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty

data class ProfessionalDTO(
    @field:Min(
        value = 0, message = "Invalid professionalId, it must be equal or greater than 0"
    )
    val professionalId: Long?,
    @field:NotEmpty(message = "Invalid skills, they must not be not empty")
    val skills: MutableSet<String>,
    val employmentState: EmploymentState?,
    val dailyRate: Float,
    @field:NotBlank(message = "Invalid location, it must not be blank")
    val location: String,
    val contact: Contact?,
    val jobApplications: MutableSet<ApplicationDTO>?
)