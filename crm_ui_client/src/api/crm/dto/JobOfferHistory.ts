import {JobOfferStatus} from "./JobOffer";
import {Application, ApplicationRawData} from "./Application";

interface JobOfferHistoryRawData {
    jobOfferHistoryId: bigint
    jobOfferStatus: JobOfferStatus
    date: string | null
    candidates: Set<ApplicationRawData>
    note: string | null
}

export class JobOfferHistory implements JobOfferHistoryRawData {
    jobOfferHistoryId: bigint
    jobOfferStatus: JobOfferStatus
    date: string | null
    candidates: Set<Application>
    note: string | null

    constructor(
        jobOfferHistoryId: bigint,
        jobOfferStatus: JobOfferStatus,
        date: string | null,
        candidates: Set<Application>,
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
            const candidates: Set<Application> | null = new Set()

            tmp.forEach((e: Application) => {
                candidates.add(e)
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
