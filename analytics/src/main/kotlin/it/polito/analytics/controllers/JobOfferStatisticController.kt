package it.polito.analytics.controllers

import it.polito.analytics.dtos.JobOfferSkillsStatisticDTO
import it.polito.analytics.dtos.JobOfferTimeStatisticDTO
import it.polito.analytics.services.JobOfferStatisticService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/jobofferstatistics")
class JobOfferStatisticController(private val jobOfferStatisticService: JobOfferStatisticService) {
    @GetMapping("/avgstatustime")
    fun getAverageStatusTime(): ResponseEntity<JobOfferTimeStatisticDTO> {
        return ResponseEntity.ok(jobOfferStatisticService.getAverageStatusTime())
    }

    @GetMapping("/skillscount")
    fun getSkillsCount(): ResponseEntity<JobOfferSkillsStatisticDTO> {
        return ResponseEntity.ok(jobOfferStatisticService.getSkillsCount())
    }
}
