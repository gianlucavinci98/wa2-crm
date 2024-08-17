import {JobOfferStatus} from "./JobOffer";

interface JobOfferHistoryRawData {
    jobOfferHistoryId: bigint
    jobOfferStatus: JobOfferStatus
    date: string | null
    note: string | null
}

export class JobOfferHistory implements JobOfferHistoryRawData {
    jobOfferHistoryId: bigint
    jobOfferStatus: JobOfferStatus
    date: string | null
    note: string | null

    constructor(
        jobOfferHistoryId: bigint,
        jobOfferStatus: JobOfferStatus,
        date: string | null,
        note: string | null
    ) {
        this.jobOfferHistoryId = jobOfferHistoryId
        this.jobOfferStatus = jobOfferStatus
        this.date = date
        this.note = note
    }

    static fromJsonObject(obj: JobOfferHistoryRawData): JobOfferHistory | null {
        try {
            return new JobOfferHistory(
                obj.jobOfferHistoryId,
                obj.jobOfferStatus,
                obj.date,
                obj.note,
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
