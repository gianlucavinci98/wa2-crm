import {Category} from "../dto/Contact"
import {JobOfferStatus} from "../dto/JobOffer";


export class JobOfferFilter {
    /**
     * This is the Customer or the Professional id.
     * */
    id: bigint | null
    category: Category | null
    status: Set<JobOfferStatus>

    /**
     * The parameters `id` and `category` go in pairs; if one of them is missing, the request returns an error.
     * */
    constructor(id: bigint | null, category: Category | null, status: Set<JobOfferStatus>) {
        this.id = id
        this.category = category
        this.status = status
    }
}
