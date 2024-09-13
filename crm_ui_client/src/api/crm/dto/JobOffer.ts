export enum JobOfferStatus {
    Created,
    SelectionPhase,
    CandidateProposal,
    Consolidated,
    Done,
    Aborted
}

interface JobOfferRawData {
    jobOfferId: number | null
    description: string
    details: string | null
    status: JobOfferStatus | null
    requiredSkills: string[]
    duration: number
    value: number | null
    selectedProfessionalId: number | null
}

export class JobOffer implements JobOfferRawData {
    jobOfferId: number | null
    description: string
    details: string | null
    status: JobOfferStatus | null
    requiredSkills: string[]
    duration: number
    value: number | null
    selectedProfessionalId: number | null

    constructor(
        jobOfferId: number | null,
        description: string,
        details: string | null,
        status: JobOfferStatus | null,
        requiredSkills: string[],
        duration: number,
        value: number | null,
        selectedProfessionalId: number | null
    ) {
        this.jobOfferId = jobOfferId
        this.description = description
        this.details = details
        this.status = status
        this.requiredSkills = requiredSkills
        this.duration = duration
        this.value = value
        this.selectedProfessionalId = selectedProfessionalId
    }

    static fromJsonObject(obj: JobOfferRawData): JobOffer | null {
        try {
            return new JobOffer(
                obj.jobOfferId,
                obj.description,
                obj.details,
                obj.status,
                obj.requiredSkills,
                obj.duration,
                obj.value,
                obj.selectedProfessionalId,
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
