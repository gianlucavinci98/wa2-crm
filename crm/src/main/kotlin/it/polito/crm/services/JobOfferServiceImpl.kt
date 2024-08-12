package it.polito.crm.services

import it.polito.crm.dtos.JobOfferDTO
import it.polito.crm.dtos.UpdateJobOfferDTO
import it.polito.crm.entities.*
import it.polito.crm.repositories.CustomerRepository
import it.polito.crm.repositories.JobOfferHistoryRepository
import it.polito.crm.repositories.JobOfferRepository
import it.polito.crm.repositories.ProfessionalRepository
import it.polito.crm.utils.*
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Predicate
import jakarta.persistence.criteria.Root
import org.hibernate.type.descriptor.jdbc.SmallIntJdbcType
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class JobOfferServiceImpl(
    private val customerRepository: CustomerRepository,
    private val jobOfferRepository: JobOfferRepository,
    private val professionalRepository: ProfessionalRepository,
    private val jobOfferHistoryRepository: JobOfferHistoryRepository,
    private val entityManager: EntityManager
) : JobOfferService {
    /* Basic operation (GET, POST, PUT, DELETE) */
    override fun getJobOfferById(jobOfferId: Long): JobOfferDTO {
        return jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }.toDto()
    }

    @Transactional
    override fun insertNewJobOffer(customerId: Long, jobOffer: JobOfferDTO): JobOfferDTO {
        val newJobOffer = JobOffer()
        val customer = customerRepository.findCustomerByCustomerId(customerId)
            .orElseThrow { CustomerNotFoundException("Customer with $customerId not found") }
        val newJobOfferHistory = JobOfferHistory()

        newJobOffer.description = jobOffer.description

        newJobOffer.duration = jobOffer.duration
        newJobOffer.requiredSkills = jobOffer.requiredSkills
        newJobOffer.customer = customer
        newJobOffer.addCustomer(customer)

        newJobOfferHistory.jobOfferStatus = JobOfferStatus.Created

        newJobOffer.addHistory(newJobOfferHistory)

        jobOfferRepository.save(newJobOffer)
        jobOfferHistoryRepository.save(newJobOfferHistory)

        return newJobOffer.toDto()
    }

    @Transactional
    override fun updateJobOfferById(jobOfferId: Long, newJobOffer: UpdateJobOfferDTO): JobOfferDTO {
        val jobOffer = jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }
        val oldStatus = jobOffer.status
        val newHistoryEntry = JobOfferHistory()

        if (oldStatus.nextSuccessStatus(newJobOffer.status) || oldStatus.nextFailureStatus(newJobOffer.status)) {
            if (!checkJobOffer(jobOffer.professional, newJobOffer)) {
                throw JobOfferProcessingException("Incorrect values inserted for the provided ${newJobOffer.status} status")
            }

            if (newJobOffer.professionalId != null) {
                val professional =
                    professionalRepository.findById(newJobOffer.professionalId)
                        .orElseThrow { ProfessionalNotFoundException("Professional with id: ${newJobOffer.professionalId} not found") }

                if (jobOffer.customer?.contact?.contactId == professional.contact.contactId) {
                    throw JobOfferProcessingException("It is not possible to assign a job offer to a professional associated to the same contact of the job offer customer")
                }

                when (newJobOffer.status) {
                    JobOfferStatus.Consolidated -> professional.employmentState = EmploymentState.Employed
                    JobOfferStatus.Done -> professional.employmentState = EmploymentState.Unemployed
                    JobOfferStatus.Aborted -> professional.employmentState = EmploymentState.Unemployed
                    else -> {}
                }

                jobOffer.addProfessional(professional)
                jobOffer.value = profitMargin * professional.dailyRate * jobOffer.duration

                professionalRepository.save(professional)
            } else {
                jobOffer.removeProfessional()
                jobOffer.value = 0.0F
            }

            if (newJobOffer.notes != null) {
                newHistoryEntry.note = newJobOffer.notes
            }

            newHistoryEntry.date = LocalDateTime.now()
            newHistoryEntry.jobOfferStatus = newJobOffer.status

            jobOffer.status = newJobOffer.status

            jobOffer.addHistory(newHistoryEntry)
            jobOfferRepository.save(jobOffer)
            jobOfferHistoryRepository.save(newHistoryEntry)
        } else {
            throw JobOfferStatusException("It is not possible to switch from $oldStatus state to ${newJobOffer.status} status")
        }

        return jobOffer.toDto()
    }

    private fun checkJobOffer(professional: Professional?, newJobOffer: UpdateJobOfferDTO): Boolean {
        return when (newJobOffer.status) {
            JobOfferStatus.SelectionPhase -> newJobOffer.professionalId == null
            JobOfferStatus.CandidateProposal -> newJobOffer.professionalId == null
            JobOfferStatus.Consolidated -> newJobOffer.professionalId != null
            JobOfferStatus.Done -> {
                if (professional != null) {
                    return newJobOffer.professionalId == professional.professionalId
                } else {
                    return false
                }
            }

            JobOfferStatus.Aborted -> {
                if (professional != null) {
                    return newJobOffer.professionalId == professional.professionalId
                } else {
                    return newJobOffer.professionalId == null
                }
            }

            else -> false
        }
    }

    override fun deleteJobOfferById(jobOfferId: Long) {
        val jobOffer = jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }
        jobOfferRepository.delete(jobOffer)
    }

    override fun getJobOfferValue(jobOfferId: Long): Float {
        return jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }.value
    }

    override fun insetNewDetails(jobOfferId: Long, details: String): JobOfferDTO {
        val jobOffer = jobOfferRepository.findById(jobOfferId).orElseThrow {
            JobOfferNotFoundException("Job offer with $jobOfferId not found")
        }

        jobOffer.details = details

        return jobOfferRepository.save(jobOffer).toDto()
    }

    /* Get filtered operation */
    override fun getAllJobOffers(
        pageNumber: Int,
        pageSize: Int,
        category: Category?,
        id: Long?,
        statusList: List<JobOfferStatus>
    ): List<JobOfferDTO> {
        if (category != null && id != null) {
            val res = when (category) {
                Category.Customer -> {
                    val customer =
                        customerRepository.findById(id)
                            .orElseThrow { CustomerNotFoundException("Customer with $id not found") }

                    customer.jobOffers.filter { statusList.contains(it.status) }
                }

                Category.Professional -> {
                    val professional =
                        professionalRepository.findById(id)
                            .orElseThrow { ProfessionalNotFoundException("Professional with $id not found") }

                    professional.jobOffers.filter { statusList.contains(it.status) }
                }

                else -> throw ParameterNotValidException("The provided Category is not valid")
            }

            return res.slice(generateRange(pageNumber, pageSize, res.size)).map { it.toDto() }
        } else if (category == null && id == null) {
            val cb: CriteriaBuilder = entityManager.criteriaBuilder

            val cqJobOffer: CriteriaQuery<JobOffer> = cb.createQuery(JobOffer::class.java)
            val rootJobOffer: Root<JobOffer> = cqJobOffer.from(JobOffer::class.java)

            val predicates = mutableListOf<Predicate>()

            statusList.forEach {
                predicates.add(cb.equal(rootJobOffer.get<SmallIntJdbcType>("status"), it))
            }

            // Combine all filters in OR
            cqJobOffer.where(cb.or(*predicates.toTypedArray()))

            val query = entityManager.createQuery(cqJobOffer)
            query.firstResult = pageNumber * pageSize
            query.maxResults = pageSize

            return query.resultList.map { it.toDto() }
        } else {
            throw ParameterNotValidException("The provided parameters are not valid")
        }
    }

    private fun generateRange(pageNumber: Int, pageSize: Int, size: Int): IntRange {
        return if (pageNumber * pageSize > size) {
            IntRange(0, size)
        } else if (pageNumber * pageSize + pageSize > size) {
            IntRange(pageNumber * pageSize, size)
        } else {
            IntRange(pageNumber * pageSize, pageSize * pageNumber + pageSize)
        }
    }
}