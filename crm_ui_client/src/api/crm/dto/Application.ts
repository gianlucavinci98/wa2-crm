export enum ApplicationStatus {
    Pending, Accepted, Aborted
}

export interface ApplicationRawData {
    professionalId: bigint
    jobOfferHistoryId: bigint
    status: ApplicationStatus
    date: string
}

export class Application implements ApplicationRawData {
    professionalId: bigint
    jobOfferHistoryId: bigint
    status: ApplicationStatus
    date: string

    constructor(professionalId: bigint, jobOfferHistoryId: bigint, status: ApplicationStatus, date: string) {
        this.professionalId = professionalId
        this.jobOfferHistoryId = jobOfferHistoryId
        this.status = status
        this.date = date
    }

    static fromJsonObject(obj: ApplicationRawData): Application | null {
        try {
            return new Application(obj.professionalId, obj.jobOfferHistoryId, obj.status, obj.date)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
