package it.polito.crm.repositories

import it.polito.crm.entities.JobOffer
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface JobOfferRepository  : JpaRepository<JobOffer, Long>