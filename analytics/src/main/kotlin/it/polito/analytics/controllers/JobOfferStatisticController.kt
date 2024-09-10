package it.polito.analytics.controllers

import it.polito.analytics.dtos.JobOfferSkillsStatisticDTO
import it.polito.analytics.dtos.JobOfferTimeStatisticDTO
import it.polito.analytics.services.JobOfferStatisticService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/jobofferstatistics")
class JobOfferStatisticController(private val jobOfferStatisticService: JobOfferStatisticService) {
    @GetMapping("/timecount")
    @PreAuthorize("hasAnyRole('ROLE_manager')")
    fun getAverageStatusTime(): ResponseEntity<JobOfferTimeStatisticDTO> {
        return ResponseEntity.ok(jobOfferStatisticService.getElapsedStatusTime())
    }

    @GetMapping("/skillscount")
    @PreAuthorize("hasAnyRole('ROLE_manager')")
    fun getSkillsCount(): ResponseEntity<JobOfferSkillsStatisticDTO> {
        return ResponseEntity.ok(jobOfferStatisticService.getSkillsCount())
    }
}
