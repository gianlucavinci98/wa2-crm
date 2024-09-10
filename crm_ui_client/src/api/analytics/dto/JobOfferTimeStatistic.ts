import {JobOfferStatus} from "../../crm/dto/JobOffer";

interface JobOfferTimeStatisticRawData {
    totalJobOffer: bigint
    timeStatistic: Array<TimeStatisticRawData>
}

interface TimeStatisticRawData {
    id: bigint
    jobOfferHistory: Array<TimeCountRawData>
}

interface TimeCountRawData {
    status: JobOfferStatus
    timeElapsed: bigint
    count: bigint
}

export class TimeStatistic implements TimeStatisticRawData {
    id: bigint
    jobOfferHistory: Array<TimeCount>

    constructor(id: bigint, jobOfferHistory: Array<TimeCount>) {
        this.id = id
        this.jobOfferHistory = jobOfferHistory
    }
}

export class TimeCount implements TimeCountRawData {
    status: JobOfferStatus
    timeElapsed: bigint
    count: bigint

    constructor(status: JobOfferStatus, timeElapsed: bigint, count: bigint) {
        this.status = status
        this.timeElapsed = timeElapsed
        this.count = count
    }
}

export class JobOfferTimeStatistic implements JobOfferTimeStatisticRawData {
    totalJobOffer: bigint
    timeStatistic: Array<TimeStatistic>

    constructor(totalJobOffer: bigint, timeStatistic: Array<TimeStatistic>) {
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
