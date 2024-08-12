package it.polito.crm.services

import it.polito.crm.dtos.ProfessionalDTO
import it.polito.crm.utils.EmploymentState

interface ProfessionalService {
    fun getAllProfessionals(
        pageNumber: Int,
        pageSize: Int,
        skills: Set<String>?,
        location: String?,
        employmentState: EmploymentState?
    ): List<ProfessionalDTO>

    fun getProfessionalById(professionalId: Long): ProfessionalDTO
    fun insertNewProfessional(contactId: Long, professional: ProfessionalDTO): ProfessionalDTO
    fun updateProfessional(professionalId: Long, professional: ProfessionalDTO): ProfessionalDTO
    fun deleteProfessional(professionalId: Long)
}