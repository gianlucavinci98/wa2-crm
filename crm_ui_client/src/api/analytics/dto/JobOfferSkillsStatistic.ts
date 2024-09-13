interface JobOfferSkillsStatisticRawData {
    totalJobOffer: number
    skillCount: Map<string, number>
}

export class JobOfferSkillsStatistic implements JobOfferSkillsStatisticRawData {
    totalJobOffer: number
    skillCount: Map<string, number>

    constructor(totalJobOffer: number, skillCount: Map<string, number>) {
        this.totalJobOffer = totalJobOffer
        this.skillCount = skillCount
    }

    static fromJsonObject(obj: JobOfferSkillsStatisticRawData): JobOfferSkillsStatistic | null {
        try {
            return new JobOfferSkillsStatistic(obj.totalJobOffer, obj.skillCount)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
