package it.polito.crm.controllers

import it.polito.crm.dtos.ProfessionalDTO
import it.polito.crm.services.ProfessionalService
import it.polito.crm.utils.EmploymentState
import jakarta.validation.Valid
import jakarta.validation.constraints.Min
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/professionals")
class ProfessionalController(private val professionalService: ProfessionalService) {
    @GetMapping("", "/")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun getAllProfessionals(
        @RequestParam("pageNumber", required = false)
        @Min(
            value = 0,
            message = "Page number not valid, value must be great or equal to 0"
        ) pageNumber: Int = 0,
        @RequestParam("pageSize", required = false)
        @Min(
            value = 1,
            message = "Page size not valid, value must be great or equal to 1"
        ) pageSize: Int = 20,
        @RequestParam("skills", required = false) skills: Set<String>?,
        @RequestParam("location", required = false) location: String?,
        @RequestParam("employmentState", required = false) employmentState: EmploymentState?,
        auth: Authentication?
    ): List<ProfessionalDTO> {
        val jwtToken = (auth?.credentials ?: "Auth is null").toString()
        println("JWT Token: $jwtToken")
        println("Principal OBJ: ${auth?.principal ?: "Auth is null"}")
        return professionalService.getAllProfessionals(pageNumber, pageSize, skills, location, employmentState)
    }

    @GetMapping("/{professionalId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    fun getProfessionalById(@PathVariable("professionalId", required = true) professionalId: Long): ProfessionalDTO {
        return professionalService.getProfessionalById(professionalId)
    }

    @PostMapping("/{contactId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager')")
    @ResponseStatus(HttpStatus.CREATED)
    fun insertNewProfessional(
        @PathVariable("contactId", required = true) contactId: Long,
        @Valid @RequestBody(required = true) professional: ProfessionalDTO
    ): ProfessionalDTO {
        return professionalService.insertNewProfessional(contactId, professional)
    }

    @PutMapping("/{professionalId}")
    @PreAuthorize("hasAnyRole('ROLE_operator','ROLE_manager')")
    fun updateProfessional(
        @PathVariable("professionalId", required = true) professionalId: Long,
        @Valid @RequestBody(required = true) professional: ProfessionalDTO
    ): ProfessionalDTO {
        return professionalService.updateProfessional(professionalId, professional)
    }

    @DeleteMapping("/{professionalId}")
    @PreAuthorize("hasAnyRole('ROLE_manager')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteProfessional(
        @PathVariable("professionalId", required = true) professionalId: Long
    ) {
        professionalService.deleteProfessional(professionalId)
    }
}
