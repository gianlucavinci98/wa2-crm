package it.polito.crm.controllers

import it.polito.crm.dtos.JobOfferDTO
import it.polito.crm.dtos.JobOfferHistoryDTO
import it.polito.crm.dtos.UpdateJobOfferDTO
import it.polito.crm.services.JobOfferService
import it.polito.crm.utils.Category
import it.polito.crm.utils.JobOfferStatus
import jakarta.validation.Valid
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotEmpty
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/joboffers")
class JobOfferController(val jobOfferService: JobOfferService) {
    @GetMapping("/{jobOfferId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    fun getJobOfferById(@PathVariable("jobOfferId", required = true) jobOfferId: Long): JobOfferDTO {
        return jobOfferService.getJobOfferById(jobOfferId)
    }

    @PostMapping("/{customerId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    @ResponseStatus(HttpStatus.CREATED)
    fun insertNewJobOffer(
        @PathVariable(
            name = "customerId",
            required = true
        ) customerId: Long,
        @Valid @RequestBody newJobOffer: JobOfferDTO
    ): JobOfferDTO {
        return jobOfferService.insertNewJobOffer(customerId, newJobOffer)
    }

    @PutMapping("/{jobOfferId}/details")
    @PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_recruiter')")
    @ResponseStatus(HttpStatus.CREATED)
    fun insetNewDetails(
        @PathVariable(
            name = "jobOfferId",
            required = true
        ) jobOfferId: Long,
        @RequestBody newDetails: String
    ): JobOfferDTO {
        return jobOfferService.insetNewDetails(jobOfferId, newDetails)
    }

    @PostMapping("/{jobOfferId}/status")
    @PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_recruiter')")
    @ResponseStatus(HttpStatus.CREATED)
    fun updateJobOfferById(
        @PathVariable(name = "jobOfferId", required = true) jobOfferId: Long,
        @RequestBody newUpdateJobOffer: UpdateJobOfferDTO
    ): JobOfferDTO {
        return jobOfferService.updateJobOfferById(jobOfferId, newUpdateJobOffer)
    }

    @DeleteMapping("/{jobOfferId}")
    @PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_recruiter')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteJobOfferById(@PathVariable("jobOfferId", required = true) jobOfferId: Long) {
        jobOfferService.deleteJobOfferById(jobOfferId)
    }

    @GetMapping("/{jobOfferId}/history")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_guest', 'ROLE_manager')")
    fun getJobOfferHistory(@PathVariable("jobOfferId", required = true) jobOfferId: Long): List<JobOfferHistoryDTO> {
        return jobOfferService.getJobOfferHistory(jobOfferId)
    }

    @GetMapping("/{jobOfferId}/value")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    fun getJobOfferValue(@PathVariable("jobOfferId", required = true) jobOfferId: Long): Float {
        return jobOfferService.getJobOfferValue(jobOfferId)
    }

    @DeleteMapping("/{jobOfferId}/{professionalId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    @ResponseStatus(HttpStatus.CREATED)
    fun deleteNewApplication(
        @PathVariable(name = "jobOfferId", required = true) jobOfferId: Long,
        @PathVariable(name = "professionalId", required = true) professionalId: Long
    ) {
        jobOfferService.deleteApplication(jobOfferId, professionalId)
    }

    @GetMapping("", "/")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    fun getAllJobOffers(
        @RequestParam("pageNumber", required = false) @Min(
            value = 0,
            message = "Page number not valid, value must be great or equal to 0"
        ) pageNumber: Int = 0,
        @RequestParam("pageSize", required = false) @Min(
            value = 1,
            message = "Page size not valid, value must be great or equal to 1"
        ) pageSize: Int = 20,
        @RequestParam("category", required = false) category: Category?,
        @RequestParam("id", required = false) id: Long?,
        @RequestParam("status", required = false) status: List<JobOfferStatus>?
    ): List<JobOfferDTO> {
        println(status)
        return jobOfferService.getAllJobOffers(pageNumber, pageSize, category, id, status ?: emptyList())
    }

    @PostMapping("/{jobOfferId}/applications/{professionalId}")
    @PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    @ResponseStatus(HttpStatus.CREATED)
    fun insertNewApplication(
        @PathVariable(name = "jobOfferId", required = true) jobOfferId: Long,
        @PathVariable(name = "professionalId", required = true) professionalId: Long
    ) {
        println("CIAO: " + jobOfferId + " - " + professionalId)
        jobOfferService.insertNewApplication(jobOfferId, professionalId)
    }
}