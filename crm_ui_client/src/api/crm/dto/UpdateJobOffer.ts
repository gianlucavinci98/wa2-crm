import {JobOfferStatus} from "./JobOffer";


export class UpdateJobOffer {
    status: JobOfferStatus
    notes: string | null
    professionalId: bigint | null

    constructor(status: JobOfferStatus, notes: string | null, professionalId: bigint | null) {
        this.status = status
        this.notes = notes
        this.professionalId = professionalId
    }
}
