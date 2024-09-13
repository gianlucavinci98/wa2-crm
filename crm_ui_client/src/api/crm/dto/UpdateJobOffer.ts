import {JobOfferStatus} from "./JobOffer";


export class UpdateJobOffer {
    status: JobOfferStatus
    notes: string | null
    selectedProfessionalId: number | null

    constructor(status: JobOfferStatus, notes: string | null, selectedProfessionalId: number | null) {
        this.status = status
        this.notes = notes
        this.selectedProfessionalId = selectedProfessionalId
    }
}
