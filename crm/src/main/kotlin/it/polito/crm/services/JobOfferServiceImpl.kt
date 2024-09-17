package it.polito.crm.services

import it.polito.crm.dtos.JobOfferDTO
import it.polito.crm.dtos.JobOfferHistoryDTO
import it.polito.crm.dtos.UpdateJobOfferDTO
import it.polito.crm.entities.ApplicationStatus
import it.polito.crm.entities.JobOffer
import it.polito.crm.entities.JobOfferHistory
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

        if (jobOffer.status.nextSuccessStatus(newJobOffer.status) ||
            jobOffer.status.nextFailureStatus(newJobOffer.status)
        ) {
            val jobOfferHistory = JobOfferHistory()

            if (jobOffer.status == JobOfferStatus.SelectionPhase || jobOffer.status == JobOfferStatus.CandidateProposal) {
                if (newJobOffer.status == JobOfferStatus.Aborted) {
                    val lastJobOfferHistory =
                        jobOffer.jobHistory.filter { it.jobOfferStatus == JobOfferStatus.SelectionPhase || it.jobOfferStatus == JobOfferStatus.CandidateProposal }
                            .maxByOrNull { it.date }!!

                    lastJobOfferHistory.candidates = lastJobOfferHistory.candidates.map {
                        it.status = ApplicationStatus.Aborted
                        it
                    }.toMutableSet()
                    jobOfferHistoryRepository.save(lastJobOfferHistory)
                }
            }

            if (newJobOffer.status == JobOfferStatus.CandidateProposal) {
                val lastJobOfferHistory =
                    jobOffer.jobHistory.filter { it.jobOfferStatus == JobOfferStatus.SelectionPhase }
                        .maxByOrNull { it.date }!!

                lastJobOfferHistory.candidates.forEach {
                    jobOfferHistory.addJobApplication(it.professional)
                }
            }

            if (newJobOffer.status == JobOfferStatus.Done) {
                val lastJobOfferHistory =
                    jobOffer.jobHistory.filter { it.jobOfferStatus == JobOfferStatus.SelectionPhase }
                        .maxByOrNull { it.date }!!

                lastJobOfferHistory.candidates = lastJobOfferHistory.candidates.map {
                    if (it.professional.professionalId == newJobOffer.selectedProfessionalId) {
                        jobOfferHistory.addJobApplication(it.professional)

                        it.status = ApplicationStatus.Accepted
                        it
                    } else {
                        it.status = ApplicationStatus.Aborted
                        it
                    }
                }.toMutableSet()
            }

            jobOfferHistory.jobOfferStatus = newJobOffer.status
            jobOfferHistory.note = newJobOffer.notes

            jobOffer.addHistory(jobOfferHistory)
            jobOffer.status = newJobOffer.status

            jobOfferHistoryRepository.save(jobOfferHistory)

            if (newJobOffer.status == JobOfferStatus.Aborted) {
                jobOffer.selectedProfessional = null
            }
            jobOfferRepository.save(jobOffer)

            return jobOffer.toDto()
        } else {
            throw JobOfferStatusException("It is not possible to switch from ${jobOffer.status} state to ${newJobOffer.status} status")
        }
    }

    override fun deleteJobOfferById(jobOfferId: Long) {
        val jobOffer = jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }
        jobOfferRepository.delete(jobOffer)
    }

    override fun insertNewApplication(
        jobOfferId: Long, professionalId: Long
    ) {
        val jobOffer = jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }

        if (jobOffer.status == JobOfferStatus.SelectionPhase) {
            val professional = professionalRepository.findById(professionalId).orElseThrow {
                ProfessionalNotFoundException("Professional with id: $professionalId not found")
            }

            val jobOfferHistory = jobOffer.jobHistory.filter { it.jobOfferStatus == JobOfferStatus.SelectionPhase }
                .maxByOrNull { it.date }!!

            jobOfferHistory.addJobApplication(professional)
            jobOfferHistoryRepository.save(jobOfferHistory)
        } else {
            throw JobOfferProcessingException("To add an application the status of the job offer must be equal to 'Selection Phase'")
        }
    }

    override fun deleteApplication(jobOfferId: Long, professionalId: Long) {
        val jobOffer = jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }

        if (jobOffer.status == JobOfferStatus.SelectionPhase) {
            val professional = professionalRepository.findById(professionalId).orElseThrow {
                ProfessionalNotFoundException("Professional with id: $professionalId not found")
            }

            val jobOfferHistory = jobOffer.jobHistory.filter { it.jobOfferStatus == JobOfferStatus.SelectionPhase }
                .maxByOrNull { it.date }!!

            jobOfferHistory.removeJobApplication(jobOfferHistory.candidates.first {
                it.professional == professional
            })
            jobOfferHistoryRepository.save(jobOfferHistory)
        } else {
            throw JobOfferProcessingException("To remove an application the status of the job offer must be equal to 'Selection Phase'")
        }
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

                    val jobOffers =
                        jobOfferHistoryRepository.findAllById(professional.jobApplications.map { it.jobOfferHistory.jobOfferHistoryId })
                            .mapNotNull { it.jobOffer }.toSet()

                    jobOffers.filter { statusList.contains(it.status) }
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

    override fun getJobOfferHistory(jobOfferId: Long): List<JobOfferHistoryDTO> {
        return jobOfferRepository.findById(jobOfferId)
            .orElseThrow { JobOfferNotFoundException("Job offer with $jobOfferId not found") }.jobHistory.map { it.toDto() }
    }
}