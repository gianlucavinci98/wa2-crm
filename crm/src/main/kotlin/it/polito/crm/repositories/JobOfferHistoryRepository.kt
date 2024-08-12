package it.polito.crm.repositories

import it.polito.crm.entities.JobOfferHistory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface JobOfferHistoryRepository : JpaRepository<JobOfferHistory, Long>