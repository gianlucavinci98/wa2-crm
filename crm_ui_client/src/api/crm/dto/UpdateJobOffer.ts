import {JobOfferStatus} from "./JobOffer";


export class UpdateJobOffer {
    status: JobOfferStatus
    notes: string | null
    selectedProfessionalId: bigint | null

    constructor(status: JobOfferStatus, notes: string | null, selectedProfessionalId: bigint | null) {
        this.status = status
        this.notes = notes
        this.selectedProfessionalId = selectedProfessionalId
    }
}
