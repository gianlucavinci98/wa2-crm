export enum JobOfferStatus {
    Created,
    SelectionPhase,
    CandidateProposal,
    Consolidated,
    Done,
    Aborted
}

interface JobOfferRawData {
    jobOfferId: bigint | null
    description: string
    details: string | null
    status: JobOfferStatus | null
    requiredSkills: Set<string>
    duration: bigint
    value: number | null
    professionalId: bigint | null
}

export class JobOffer implements JobOffer {
    jobOfferId: bigint | null
    description: string
    details: string | null
    status: JobOfferStatus | null
    requiredSkills: Set<string>
    duration: bigint
    value: number | null
    professionalId: bigint | null

    constructor(
        jobOfferId: bigint | null,
        description: string,
        details: string | null,
        status: JobOfferStatus | null,
        requiredSkills: Set<string>,
        duration: bigint,
        value: number | null,
        professionalId: bigint | null
    ) {
        this.jobOfferId = jobOfferId
        this.description = description
        this.details = details
        this.status = status
        this.requiredSkills = requiredSkills
        this.duration = duration
        this.value = value
        this.professionalId = professionalId
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
                obj.professionalId,
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
