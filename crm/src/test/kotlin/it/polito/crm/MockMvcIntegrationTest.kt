package it.polito.crm

import it.polito.crm.dtos.CustomerDTO
import it.polito.crm.dtos.JobOfferDTO
import it.polito.crm.dtos.ProfessionalDTO
import it.polito.crm.entities.Contact
import it.polito.crm.utils.EmploymentState
import it.polito.crm.utils.JobOfferStatus
import org.hamcrest.Matchers.hasSize
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql
import org.springframework.test.web.servlet.*
import org.springframework.transaction.annotation.Transactional
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper

@AutoConfigureMockMvc
class MockMvcIntegrationTest: IntegrationTest() {
    @Autowired
    private lateinit var mockMvc: MockMvc

    //test for Customer Controller

    @Test
    @Sql("/sql/customer/testCustomerController.sql")
    @Transactional
    @Rollback
    fun `getCustomerById - should return customer DTO`() {
        // Given
        val customerId = 100L
        val customerDTO = CustomerDTO(customerId, mutableSetOf("Note 1", "Note 2"), Contact())

        // When/Then
        mockMvc.get("/api/customers/$customerId") {
            accept = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
            content { contentType(MediaType.APPLICATION_JSON) }
            jsonPath("$.customerId") { value(customerDTO.customerId?.toInt()) }
            jsonPath("$.notes") { listOf("Note 1", "Note 2") }
        }
    }

    @Test
    @Sql("/sql/customer/testCustomerController.sql")
    @Transactional
    @Rollback
    fun `insertNewCustomer - should insert new customer and return DTO`() {
        // Given
        val contactId = 300L

        // When/Then
        mockMvc.post("/api/customers/$contactId") {
            accept = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isCreated() }
            content { contentType(MediaType.APPLICATION_JSON) }
            jsonPath("$.customerId") { value(1L) }
        }
    }

    @Test
    @Sql("/sql/customer/testCustomerController.sql")
    @Transactional
    @Rollback
    fun `deleteCustomerById - should delete customer`() {
        // Given
        val customerId = 100L

        // When/Then
        mockMvc.delete("/api/customers/$customerId").andExpect {
            status { isNoContent() }
        }
    }

    @Test
    @Sql("/sql/customer/testCustomerController.sql")
    @Transactional
    @Rollback

    fun `insertNewNote - should insert new note for customer and return DTO`() {
        // Given
        val customerId = 200L
        val note = "New Note"

        // When/Then
        mockMvc.post("/api/customers/$customerId/notes") {
            contentType = MediaType.APPLICATION_JSON
            content = note
        }.andExpect {
            status { isCreated() }
            content { contentType(MediaType.APPLICATION_JSON) }
            jsonPath("$.customerId") { value(customerId) }
            jsonPath("$.notes") { value(note) }
        }
    }

    //test for Professional Controller

    @Test
    @Sql("/sql/professional/testProfessionalController.sql")
    @Transactional
    @Rollback
    fun `getAllProfessionals - should return list of professionals`() {
        // Given
        val pageNumber = 0
        val pageSize = 10
        val skills = mutableSetOf("Skill 1", "Skill 2")
        val location = "New York"
        val employmentState = EmploymentState.Employed
        val professionalDTOList = listOf(
            ProfessionalDTO(100L,   skills, employmentState,30.0f, location,  Contact()),
            ProfessionalDTO(200L,   skills, employmentState, 25.0f, location,Contact())
        )

        // When/Then
        mockMvc.get("/api/professionals") {
            param("pageNumber", pageNumber.toString())
            param("pageSize", pageSize.toString())
            param("skills", skills.joinToString(","))
            param("location", location)
            param("employmentState", employmentState.toString())
            accept = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
            content { contentType(MediaType.APPLICATION_JSON) }
            content {
                jsonPath("$") {
                    isArray()
                    value(hasSize<ProfessionalDTO>(1))
                }
                jsonPath("$[0].professionalId") { value(professionalDTOList[0].professionalId?.toInt()) }
                jsonPath("$[0].dailyRate") { value(professionalDTOList[0].dailyRate.toDouble()) }
                jsonPath("$[0].location") { value(professionalDTOList[0].location) }
                jsonPath("$[0].skills") { listOf( "Skill 1", "Skill 2") }
                jsonPath("$[0].employmentState") { value(professionalDTOList[1].employmentState.toString()) }
            }
        }
    }

    @Test
    @Sql("/sql/professional/testProfessionalController.sql")
    @Transactional
    @Rollback
    fun `getProfessionalById - should return professional DTO`() {
        // Given
        val professionalId = 100L
        val professionalDTO = ProfessionalDTO(professionalId,  mutableSetOf("Skill 1", "Skill 2"), EmploymentState.Employed, 30.0f, "New York",Contact())

        // When/Then
        mockMvc.get("/api/professionals/$professionalId") {
            accept = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
            content { contentType(MediaType.APPLICATION_JSON) }
            jsonPath("$.professionalId") { value(professionalDTO.professionalId?.toInt()) }
            jsonPath("$.dailyRate") { value(professionalDTO.dailyRate.toDouble()) }
            jsonPath("$.location") { value(professionalDTO.location) }
            jsonPath("$.skills") { listOf( "Skill 1", "Skill 2") }
            jsonPath("$.employmentState") { value(professionalDTO.employmentState.toString()) }
        }
    }

    @Test
    @Sql("/sql/professional/testProfessionalController.sql")
    @Transactional
    @Rollback
    fun `insertNewProfessional - should insert new professional and return DTO`() {
        // Given
        val contactId = 300L
        val professionalDTO = ProfessionalDTO(  null, mutableSetOf("Skill 3", "Skill 4"), null,15.0f, "New York",null)

        // When/Then
        mockMvc.post("/api/professionals/$contactId") {
            contentType = MediaType.APPLICATION_JSON
            content = ObjectMapper().writeValueAsString(professionalDTO)
        }.andExpect {
            status { isCreated() }
            content { contentType(MediaType.APPLICATION_JSON) }
            jsonPath("$.dailyRate") { value(professionalDTO.dailyRate.toDouble()) }
            jsonPath("$.location") { value(professionalDTO.location) }
            jsonPath("$.employmentState") { value("Unemployed") }
            jsonPath("$.contact.contactId") { value(contactId) }
        }
    }

    @Test
    @Sql("/sql/professional/testProfessionalController.sql")
    @Transactional
    @Rollback
    fun `updateProfessional - should update professional and return DTO`() {
        // Given
        val professionalId = 100L
        val professionalDTO = ProfessionalDTO(professionalId, mutableSetOf("Skill 6", "Skill 9"), EmploymentState.Unemployed,12.0f, "New York",  null)

        // When/Then
        mockMvc.put("/api/professionals/$professionalId") {
            contentType = MediaType.APPLICATION_JSON
            content = ObjectMapper().writeValueAsString(professionalDTO)
        }.andExpect {
            status { isOk() }
            content { contentType(MediaType.APPLICATION_JSON) }
            jsonPath("$.professionalId") { value(professionalDTO.professionalId?.toInt()) }
            jsonPath("$.dailyRate") { value(professionalDTO.dailyRate.toDouble()) }
            jsonPath("$.location") { value(professionalDTO.location) }
            jsonPath("$.employmentState") { value(professionalDTO.employmentState.toString()) }
        }
    }

    @Test
    @Sql("/sql/professional/testProfessionalController.sql")
    @Transactional
    @Rollback
    fun `deleteProfessional - should delete professional`() {
        // Given
        val professionalId = 100L

        // When/Then
        mockMvc.delete("/api/professionals/$professionalId").andExpect {
            status { isNoContent() }
        }
    }

    @Test
    @Sql("/sql/jobOffer/testJobOfferController.sql")
    @Transactional
    @Rollback
    fun `getJobOfferById - should return job offer DTO`() {
        // Given
        val jobOfferId = 100L
        val jobOfferDTO = JobOfferDTO(
            jobOfferId, "Job Offer 1", "Details", JobOfferStatus.Created, mutableSetOf("Skill 1", "Skill 2"), 30, 1000.0f, null
        )

        // When/Then
        mockMvc.get("/api/joboffers/$jobOfferId") {
            accept = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
            content { contentType(MediaType.APPLICATION_JSON) }
            jsonPath("$.jobOfferId") { value(jobOfferDTO.jobOfferId?.toInt()) }
            jsonPath("$.description") { value(jobOfferDTO.description) }
            jsonPath("$.details") { value(jobOfferDTO.details) }
            jsonPath("$.status") { value(jobOfferDTO.status!!.toString()) }
            jsonPath("$.requiredSkills") { value(jobOfferDTO.requiredSkills.toList()) }
            jsonPath("$.duration") { value(jobOfferDTO.duration.toInt()) }
            jsonPath("$.value") { value(jobOfferDTO.value?.toDouble()) }
            jsonPath("$.professionalId") { doesNotExist() }
        }
    }

    @Test
    @Sql("/sql/jobOffer/testJobOfferController.sql")
    @Transactional
    @Rollback
    fun `insertNewJobOffer - should insert new job offer and return DTO`() {
        // Given
        val customerId = 100L
        val newJobOfferDTO = JobOfferDTO(null, "New Job Offer", null, JobOfferStatus.Created, mutableSetOf("Skill 3", "Skill 276"), 45, null, null)

        // When/Then
        mockMvc.post("/api/joboffers/$customerId") {
            accept = MediaType.APPLICATION_JSON
            contentType = MediaType.APPLICATION_JSON
            content = ObjectMapper().writeValueAsString(newJobOfferDTO)
        }.andExpect {
            status { isCreated() }
            content { contentType(MediaType.APPLICATION_JSON) }
            jsonPath("$.jobOfferId") { isNumber() }
            jsonPath("$.description") { value(newJobOfferDTO.description) }
            jsonPath("$.status") { value(newJobOfferDTO.status!!.toString()) }
            jsonPath("$.requiredSkills") { value(newJobOfferDTO.requiredSkills.toList()) }
            jsonPath("$.duration") { value(newJobOfferDTO.duration.toInt()) }
            jsonPath("$.professionalId") { doesNotExist() }
        }
    }

    @Test
    @Sql("/sql/jobOffer/testJobOfferController.sql")
    @Transactional
    @Rollback
    fun `deleteJobOfferById - should delete job offer`() {
        // Given
        val jobOfferId = 100L

        // When/Then
        mockMvc.delete("/api/joboffers/$jobOfferId").andExpect {
            status { isNoContent() }
        }
    }

    @Test
    @Sql("/sql/jobOffer/testJobOfferController.sql")
    @Transactional
    @Rollback
    fun `getJobOfferValue - should return job offer value`() {
        // Given
        val jobOfferId = 100L

        // When/Then
        mockMvc.get("/api/joboffers/$jobOfferId/value") {
            accept = MediaType.APPLICATION_JSON
        }.andExpect {
            status { isOk() }
            content { contentType(MediaType.APPLICATION_JSON) }
            content { string("1000.0") } // Assuming job offer value is 1000.0
        }
    }

    @Test
    @Sql("/sql/jobOffer/testJobOfferController.sql")
    @Transactional
    @Rollback
    fun `getAllJobOffers - should return list of job offer DTOs`() {
        // Given
        val pageNumber = 0
        val pageSize = 20
        val statusList = listOf(JobOfferStatus.Created, JobOfferStatus.Done)

        // When/Then
        mockMvc.get("/api/joboffers") {
            accept = MediaType.APPLICATION_JSON
            param("pageNumber", pageNumber.toString())
            param("pageSize", pageSize.toString())
            param("status", statusList.joinToString(",") { it.toString() })
        }.andExpect {
            status { isOk() }
            content { contentType(MediaType.APPLICATION_JSON) }
            jsonPath("$"){value(hasSize<JobOfferDTO>(2)) }
        // Assuming there are 2 job offers with status Created or Done
        }
    }
}