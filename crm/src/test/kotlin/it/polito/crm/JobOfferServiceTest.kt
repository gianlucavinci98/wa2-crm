package it.polito.crm

import it.polito.crm.dtos.JobOfferDTO
import it.polito.crm.dtos.UpdateJobOfferDTO
import it.polito.crm.services.CustomerService
import it.polito.crm.services.JobOfferService
import it.polito.crm.utils.*
import jakarta.transaction.Transactional
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql

class JobOfferServiceTest : IntegrationTest() {
    @Autowired
    private lateinit var jobOfferService: JobOfferService

    @Autowired
    private lateinit var customerService: CustomerService

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `getJobOfferById - should return job offer when found`() {
        val jobOfferId = 124L

        val result = jobOfferService.getJobOfferById(jobOfferId)

        assertNotNull(result)
        assertEquals(jobOfferId, result.jobOfferId)
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `getJobOfferById - not found`() {
        assertThrows<JobOfferNotFoundException> { jobOfferService.getJobOfferById(1000) }
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `insertNewJobOffer - should insert new job offer`() {
        val customer = customerService.getCustomerById(100L)
        val jobOfferDto = JobOfferDTO(null, "Test job offer", "", null, mutableSetOf("Skill1", "Skill2"), 10, 0f, null)

        val result = customer.customerId?.let { jobOfferService.insertNewJobOffer(it, jobOfferDto) }

        assertNotNull(result)
        if (result != null) {
            assertNotNull(result.jobOfferId)
        }
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `insertNewJobOffer - customer not found`() {
        val jobOfferDto = JobOfferDTO(null, "Test job offer", "", null, mutableSetOf("Skill1", "Skill2"), 10, 0f, null)

        assertThrows<CustomerNotFoundException> { jobOfferService.insertNewJobOffer(1000, jobOfferDto) }
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `updateJobOfferById - should update job offer`() {
        val jobOfferId = 124L
        val newJobOffer = UpdateJobOfferDTO(JobOfferStatus.SelectionPhase, null, null)

        val result = jobOfferService.updateJobOfferById(jobOfferId, newJobOffer)

        assertNotNull(result)
        assertEquals(JobOfferStatus.SelectionPhase, result.status)
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `updateJobOfferById - test the status sequence 1`() {
        val jobOfferId = 124L

        val newJobOffer1 = UpdateJobOfferDTO(JobOfferStatus.SelectionPhase, null, null)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer1) }

        val newJobOffer2 = UpdateJobOfferDTO(JobOfferStatus.CandidateProposal, null, null)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer2) }

        val newJobOffer3 = UpdateJobOfferDTO(JobOfferStatus.Consolidated, null, 100)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer3) }

        val newJobOffer4 = UpdateJobOfferDTO(JobOfferStatus.SelectionPhase, null, null)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer4) }

        val newJobOffer5 = UpdateJobOfferDTO(JobOfferStatus.CandidateProposal, null, null)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer5) }

        val newJobOffer6 = UpdateJobOfferDTO(JobOfferStatus.Consolidated, null, 100)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer6) }

        val newJobOffer7 = UpdateJobOfferDTO(JobOfferStatus.Done, null, 100)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer7) }
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `updateJobOfferById - test the status sequence 2`() {
        val jobOfferId = 124L

        val newJobOffer1 = UpdateJobOfferDTO(JobOfferStatus.SelectionPhase, null, null)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer1) }

        val newJobOffer2 = UpdateJobOfferDTO(JobOfferStatus.Done, null, 100)
        assertThrows<JobOfferStatusException> { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer2) }
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `updateJobOfferById - it is not possible to assign a job offer to a professional associated to the same contact of the job offer customer`() {
        val jobOfferId = 124L

        val newJobOffer1 = UpdateJobOfferDTO(JobOfferStatus.SelectionPhase, null, null)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer1) }

        val newJobOffer2 = UpdateJobOfferDTO(JobOfferStatus.CandidateProposal, null, null)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer2) }

        val newJobOffer3 = UpdateJobOfferDTO(JobOfferStatus.Consolidated, null, 101)
        assertThrows<JobOfferProcessingException> { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer3) }
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `updateJobOfferById - invalid parameter provided for the new status 1`() {
        val jobOfferId = 124L

        val newJobOffer1 = UpdateJobOfferDTO(JobOfferStatus.SelectionPhase, null, null)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer1) }

        // assigned a professionalId when it is not necessary
        val newJobOffer2 = UpdateJobOfferDTO(JobOfferStatus.CandidateProposal, null, 100)
        assertThrows<JobOfferProcessingException> { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer2) }
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `updateJobOfferById - invalid parameter provided for the new status 2`() {
        val jobOfferId = 124L

        val newJobOffer1 = UpdateJobOfferDTO(JobOfferStatus.SelectionPhase, null, null)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer1) }

        val newJobOffer2 = UpdateJobOfferDTO(JobOfferStatus.CandidateProposal, null, null)
        assertDoesNotThrow { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer2) }

        // assigned null to professionalId when it is necessary
        val newJobOffer3 = UpdateJobOfferDTO(JobOfferStatus.Consolidated, null, null)
        assertThrows<JobOfferProcessingException> { jobOfferService.updateJobOfferById(jobOfferId, newJobOffer3) }
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `deleteJobOfferById - should delete job offer`() {
        val jobOfferId = 124L

        jobOfferService.deleteJobOfferById(jobOfferId)

        assertThrows<RuntimeException> {
            jobOfferService.getJobOfferById(jobOfferId)
        }
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `getJobOfferValue - should return value of job offer`() {
        val result = jobOfferService.getJobOfferValue(124)

        assertEquals(0f, result)
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `getAllJobOffers - should return paginated job offers`() {
        val pageNumber = 0
        val pageSize = 10
        val statusList = listOf(JobOfferStatus.Created, JobOfferStatus.Consolidated)

        val result = jobOfferService.getAllJobOffers(pageNumber, pageSize, null, null, statusList)

        assertNotNull(result)
        assertFalse(result.isEmpty())
    }

    @Test
    @Sql("/sql/jobOffer/testGetJobOffer.sql")
    @Transactional
    @Rollback
    fun `deleteJobOfferById - should throw exception for non-existent job offer`() {
        val nonExistentJobOfferId = 1000L // Un ID che non esiste nel database

        assertThrows<RuntimeException> {
            jobOfferService.deleteJobOfferById(nonExistentJobOfferId)
        }
    }
}