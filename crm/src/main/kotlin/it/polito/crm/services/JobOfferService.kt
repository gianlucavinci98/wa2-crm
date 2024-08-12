package it.polito.crm.services

import it.polito.crm.dtos.JobOfferDTO
import it.polito.crm.dtos.UpdateJobOfferDTO
import it.polito.crm.utils.Category
import it.polito.crm.utils.JobOfferStatus

interface JobOfferService {
    /* Basic operation (GET, POST, PUT, DELETE) */
    fun getJobOfferById(jobOfferId: Long): JobOfferDTO
    fun insertNewJobOffer(customerId: Long, jobOffer: JobOfferDTO): JobOfferDTO
    fun updateJobOfferById(jobOfferId: Long, newJobOffer: UpdateJobOfferDTO): JobOfferDTO
    fun deleteJobOfferById(jobOfferId: Long)
    fun getJobOfferValue(jobOfferId: Long): Float
    fun insetNewDetails(jobOfferId: Long, details: String): JobOfferDTO

    /* Get filtered operation */
    fun getAllJobOffers(pageNumber: Int, pageSize: Int, category: Category?, id: Long?, statusList: List<JobOfferStatus>): List<JobOfferDTO>
}