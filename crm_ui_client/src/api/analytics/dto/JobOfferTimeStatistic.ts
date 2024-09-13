import {JobOfferStatus} from "../../crm/dto/JobOffer";

interface JobOfferTimeStatisticRawData {
    totalJobOffer: number
    timeStatistic: Array<TimeStatisticRawData>
}

interface TimeStatisticRawData {
    id: number
    jobOfferHistory: Array<TimeCountRawData>
}

interface TimeCountRawData {
    status: JobOfferStatus
    timeElapsed: number
    count: number
}

export class TimeStatistic implements TimeStatisticRawData {
    id: number
    jobOfferHistory: Array<TimeCount>

    constructor(id: number, jobOfferHistory: Array<TimeCount>) {
        this.id = id
        this.jobOfferHistory = jobOfferHistory
    }
}

export class TimeCount implements TimeCountRawData {
    status: JobOfferStatus
    timeElapsed: number
    count: number

    constructor(status: JobOfferStatus, timeElapsed: number, count: number) {
        this.status = status
        this.timeElapsed = timeElapsed
        this.count = count
    }
}

export class JobOfferTimeStatistic implements JobOfferTimeStatisticRawData {
    totalJobOffer: number
    timeStatistic: TimeStatistic[]

    constructor(totalJobOffer: number, timeStatistic: TimeStatistic[]) {
        this.totalJobOffer = totalJobOffer
        this.timeStatistic = timeStatistic
    }

    static fromJsonObject(obj: JobOfferTimeStatisticRawData): JobOfferTimeStatistic | null {
        try {
            return new JobOfferTimeStatistic(
                obj.totalJobOffer,
                obj.timeStatistic.map((e) => new TimeStatistic(
                    e.id,
                    e.jobOfferHistory.map((i) => new TimeCount(
                        i.status,
                        i.timeElapsed,
                        i.count)
                    )
                ))
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
