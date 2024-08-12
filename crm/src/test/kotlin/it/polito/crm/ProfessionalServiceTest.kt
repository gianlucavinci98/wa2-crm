package it.polito.crm

import it.polito.crm.dtos.ContactDTO
import it.polito.crm.dtos.ProfessionalDTO
import it.polito.crm.services.ContactService
import it.polito.crm.services.ProfessionalService
import it.polito.crm.utils.*
import jakarta.transaction.Transactional
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql

class ProfessionalServiceTest : IntegrationTest() {
    @Autowired
    private lateinit var professionalService: ProfessionalService

    @Autowired
    private lateinit var contactService: ContactService

    @Test
    @Sql("/sql/professional/testGetProfessional.sql")
    @Transactional
    @Rollback
    fun getAllProfessionalsTest() {
        val pageNumber = 0
        val pageSize = 10
        val skills = setOf("Cleaner")
        val location = "New York"
        val employmentState = EmploymentState.Unemployed

        val result = professionalService.getAllProfessionals(pageNumber, pageSize, skills, location, employmentState)

        assertNotNull(result)
        assertEquals(2, result.size)
        assertEquals(100, result[0].professionalId)
        assertEquals(102, result[1].professionalId)
        assertEquals("New York", result[0].location)
        assertEquals("New York", result[1].location)
        assertTrue(result[0].skills.containsAll(setOf("Cleaner")))
        assertTrue(result[1].skills.containsAll(setOf("Cleaner")))
        assertEquals(EmploymentState.Unemployed, result[0].employmentState)
        assertEquals(EmploymentState.Unemployed, result[1].employmentState)
    }

    @Test
    @Transactional
    @Rollback
    fun insertNewProfessionalTest() {
        val contactDto = ContactDTO(null, "John", "Doe", "123456789", null)
        val contact = contactService.insertNewContact(contactDto)

        assert(contact != null)

        val professionalDto = ProfessionalDTO(
            dailyRate = 20f,
            location = "San José",
            skills = mutableSetOf("Cleaner"),
            employmentState = null,
            professionalId = null,
            contact = null
        )

        val professional = contact?.let { professionalService.insertNewProfessional(it.contactId!!, professionalDto) }

        assert(professional != null)

        assertEquals(contactDto.name, professional?.contact?.name)
        assertEquals(contactDto.surname, professional?.contact?.surname)
        assertEquals(professional?.contact?.category, Category.Professional)
        assertEquals(professionalDto.dailyRate, professional?.dailyRate)
        assertEquals(professionalDto.location, professional?.location)
        assertEquals(professionalDto.skills, professional?.skills)
        assertEquals(EmploymentState.Unemployed, professional?.employmentState)
    }

    @Test
    @Sql("/sql/professional/testGetProfessional.sql")
    @Transactional
    @Rollback
    fun `insert new professional to a contact that is linked already to a customer profile`() {
        val professionalDto = ProfessionalDTO(
            dailyRate = 20f,
            location = "San José",
            skills = mutableSetOf("Cleaner"),
            employmentState = null,
            professionalId = null,
            contact = null
        )

        assertDoesNotThrow { professionalService.insertNewProfessional(104, professionalDto) }

        val contact = contactService.getContactById(104)!!

        assertEquals(contact.category, Category.CustomerProfessional)
    }

    @Test
    @Transactional
    @Rollback
    fun insertNewProfessionalContactNotFoundTest() {
        val professionalDto = ProfessionalDTO(
            dailyRate = 20f,
            location = "San José",
            skills = mutableSetOf("Cleaner"),
            employmentState = null,
            professionalId = null,
            contact = null
        )

        assertThrows<ContactNotFoundException> { professionalService.insertNewProfessional(1000, professionalDto) }
    }

    @Test
    @Transactional
    @Rollback
    fun insertNewProfessionalConflictTest() {
        val contactDto = ContactDTO(null, "John", "Doe", "123456789", null)
        val contact = contactService.insertNewContact(contactDto)

        assert(contact != null)

        val professionalDto = ProfessionalDTO(
            dailyRate = 20f,
            location = "San José",
            skills = mutableSetOf("Cleaner"),
            employmentState = null,
            professionalId = null,
            contact = null
        )

        assertDoesNotThrow { professionalService.insertNewProfessional(contact?.contactId!!, professionalDto) }

        assertThrows<ProfessionalConflictException> {
            professionalService.insertNewProfessional(contact?.contactId!!, professionalDto)
        }
    }

    @Test
    @Transactional
    @Rollback
    fun `getProfessionalById - should return professional when found`() {
        val contactDto = ContactDTO(null, "John", "Doe", "123456789", Category.Unknown)

        val contact = contactService.insertNewContact(contactDto)

        assert(contact != null)
        val professionalDto = ProfessionalDTO(
            dailyRate = 20f,
            location = "San José",
            skills = mutableSetOf("Cleaner"),
            employmentState = EmploymentState.Unemployed,
            professionalId = null,
            contact = null
        )
        val professional = contact?.let { professionalService.insertNewProfessional(it.contactId!!, professionalDto) }

        val result = professional?.professionalId?.let { professionalService.getProfessionalById(it) }

        assertEquals(professionalDto.dailyRate, result?.dailyRate)
        assertEquals(professionalDto.location, result?.location)
        assertEquals(professionalDto.skills, result?.skills)
        assertEquals(EmploymentState.Unemployed, result?.employmentState)
    }

    @Test
    @Transactional
    @Rollback
    fun `getProfessionalById - should throw exception when professional not found`() {
        val exception = assertThrows<ProfessionalNotFoundException> { professionalService.getProfessionalById(1) }
        assertEquals("Professional with id: 1 not found", exception.message)
    }

    @Test
    @Transactional
    @Sql("/sql/professional/testGetProfessional.sql")
    @Rollback
    fun updateProfessionalTest() {
        val professional = professionalService.getProfessionalById(100)
        val updateProfessionalDto = ProfessionalDTO(
            dailyRate = 25f,
            location = "New York",
            skills = mutableSetOf("Cleaner", "Organizer"),
            employmentState = EmploymentState.Employed,
            professionalId = null,
            contact = null
        )

        val updatedProfessional =
            professional.professionalId?.let { professionalService.updateProfessional(it, updateProfessionalDto) }

        assertNotNull(updatedProfessional)
        if (updatedProfessional != null) {
            assertEquals(professional.professionalId, updatedProfessional.professionalId)
        }
        if (updatedProfessional != null) {
            assertEquals(updateProfessionalDto.dailyRate, updatedProfessional.dailyRate)
        }
        if (updatedProfessional != null) {
            assertEquals(updateProfessionalDto.location, updatedProfessional.location)
        }
        if (updatedProfessional != null) {
            assertEquals(updateProfessionalDto.skills, updatedProfessional.skills)
        }
        if (updatedProfessional != null) {
            assertEquals(updateProfessionalDto.employmentState, updatedProfessional.employmentState)
        }
    }

    @Test
    @Transactional
    @Sql("/sql/professional/testGetProfessional.sql")
    @Rollback
    fun deleteProfessionalTest() {
        assertDoesNotThrow { professionalService.deleteProfessional(100) }

        assertThrows<ProfessionalNotFoundException> { professionalService.getProfessionalById(100) }
    }

    @Test
    @Transactional
    @Sql("/sql/professional/testGetProfessional.sql")
    @Rollback
    fun deleteProfessionalButNotAssociatedContactTest() {
        val professional = professionalService.getProfessionalById(100)

        assertDoesNotThrow { professionalService.deleteProfessional(100) }

        assertDoesNotThrow { contactService.getContactById(professional.contact?.contactId!!) }

        val contact = contactService.getContactById(professional.contact?.contactId!!)!!

        assertEquals(contact.category, Category.Unknown)
    }
}