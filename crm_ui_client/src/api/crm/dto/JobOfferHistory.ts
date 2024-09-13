import {JobOfferStatus} from "./JobOffer";
import {Application, ApplicationRawData} from "./Application";

interface JobOfferHistoryRawData {
    jobOfferHistoryId: number
    jobOfferStatus: JobOfferStatus
    date: string | null
    candidates: ApplicationRawData[]
    note: string | null
}

export class JobOfferHistory implements JobOfferHistoryRawData {
    jobOfferHistoryId: number
    jobOfferStatus: JobOfferStatus
    date: string | null
    candidates: Application[]
    note: string | null

    constructor(
        jobOfferHistoryId: number,
        jobOfferStatus: JobOfferStatus,
        date: string | null,
        candidates: Application[],
        note: string | null
    ) {
        this.jobOfferHistoryId = jobOfferHistoryId
        this.jobOfferStatus = jobOfferStatus
        this.date = date
        this.candidates = candidates
        this.note = note
    }

    static fromJsonObject(obj: JobOfferHistoryRawData): JobOfferHistory | null {
        try {
            const tmp: Array<Application> = Array.from(obj.candidates.values()).map((e: ApplicationRawData) => Application.fromJsonObject(e)!)
            const candidates: Application[] | null = []

            tmp.forEach((e: Application) => {
                candidates.push(e)
            })

            return new JobOfferHistory(
                obj.jobOfferHistoryId,
                obj.jobOfferStatus,
                obj.date,
                candidates,
                obj.note
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
