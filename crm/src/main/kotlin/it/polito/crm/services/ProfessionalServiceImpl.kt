package it.polito.crm.services

import it.polito.crm.dtos.ProfessionalDTO
import it.polito.crm.entities.Professional
import it.polito.crm.repositories.ContactRepository
import it.polito.crm.repositories.ProfessionalRepository
import it.polito.crm.utils.*
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Predicate
import jakarta.persistence.criteria.Root
import org.hibernate.exception.ConstraintViolationException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProfessionalServiceImpl(
    private val entityManager: EntityManager,
    private val contactRepository: ContactRepository,
    private val professionalRepository: ProfessionalRepository
) : ProfessionalService {
    @Transactional
    override fun getAllProfessionals(
        pageNumber: Int,
        pageSize: Int,
        skills: Set<String>?,
        location: String?,
        employmentState: EmploymentState?
    ): List<ProfessionalDTO> {
        val cb: CriteriaBuilder = entityManager.criteriaBuilder

        val cqProfessional: CriteriaQuery<Professional> = cb.createQuery(Professional::class.java)
        val rootProfessional: Root<Professional> = cqProfessional.from(Professional::class.java)

        val predicates = mutableListOf<Predicate>()

        if (!skills.isNullOrEmpty()) {
            val skillPredicate =
                cb.and(*skills.map { cb.isMember(it, rootProfessional.get<Set<String>>("skills")) }.toTypedArray())
            predicates.add(skillPredicate)
        }

        if (!location.isNullOrBlank()) {
            predicates.add(cb.equal(rootProfessional.get<String>("location"), location))
        }

        if (employmentState != null) {
            predicates.add(cb.equal(rootProfessional.get<String>("employmentState"), employmentState))
        }
        cqProfessional.where(*predicates.toTypedArray())
        cqProfessional.orderBy(cb.asc(rootProfessional.get<Long>("professionalId")))

        val query = entityManager.createQuery(cqProfessional)
        query.firstResult = pageNumber * pageSize
        query.maxResults = pageSize

        return query.resultList.map { it.toDto() }
    }

    override fun getProfessionalById(professionalId: Long): ProfessionalDTO {
        return professionalRepository.findById(professionalId)
            .orElseThrow { ProfessionalNotFoundException("Professional with id: $professionalId not found") }.toDto()
    }

    override fun insertNewProfessional(contactId: Long, professional: ProfessionalDTO): ProfessionalDTO {
        val contact =
            contactRepository.findById(contactId)
                .orElseThrow { ContactNotFoundException("Contact with id: $contactId not found") }

        val newProfessional = Professional()
        try {
            when (contact.category) {
                Category.Customer -> contact.category = Category.CustomerProfessional
                Category.Unknown -> contact.category = Category.Professional
                else -> throw ProfessionalConflictException("The contact $contactId has already been associated to a professional profile")
            }

            newProfessional.contact = contact
            newProfessional.skills = professional.skills
            newProfessional.location = professional.location
            newProfessional.dailyRate = professional.dailyRate

            contactRepository.save(contact)
            return professionalRepository.save(newProfessional).toDto()
        } catch (e: ProfessionalConflictException) {
            throw e
        } catch (e: Exception) {
            throw ProfessionalProcessingException("Error in creating new professional")
        }
    }

    override fun updateProfessional(professionalId: Long, professional: ProfessionalDTO): ProfessionalDTO {
        val oldProfessional =
            professionalRepository.findById(professionalId)
                .orElseThrow { ProfessionalNotFoundException("Professional with id: $professionalId not found") }

        try {
            oldProfessional.skills = professional.skills
            oldProfessional.dailyRate = professional.dailyRate
            oldProfessional.location = professional.location
            if (professional.employmentState != null) {
                oldProfessional.employmentState = professional.employmentState
            }

            return professionalRepository.save(oldProfessional).toDto()
        } catch (e: Exception) {
            throw ProfessionalProcessingException("Error in updating the professional")
        }
    }

    override fun deleteProfessional(professionalId: Long) {
        val professional =
            professionalRepository.findById(professionalId)
                .orElseThrow { ProfessionalNotFoundException("professional not found") }

        when (professional.contact.category) {
            Category.Professional -> professional.contact.category = Category.Unknown
            Category.CustomerProfessional -> professional.contact.category = Category.Customer
            else -> professional.contact.category = Category.Unknown
        }

        try {
            professionalRepository.delete(professional)
        } catch (e: DataIntegrityViolationException) {
            if (e.cause is ConstraintViolationException) {
                throw ProfessionalProcessingException("Delete of a professional is only permitted if the professional is not associated with any job offer")
            } else {
                throw e
            }
        } catch (e: Exception) {
            throw ProfessionalProcessingException("Error occurred while deleting professional with ID $professionalId")
        }

        contactRepository.save(professional.contact)
    }
}