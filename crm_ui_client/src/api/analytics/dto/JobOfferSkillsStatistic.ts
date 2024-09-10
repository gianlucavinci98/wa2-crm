interface JobOfferSkillsStatisticRawData {
    totalJobOffer: bigint
    skillCount: Map<string, bigint>
}

export class JobOfferSkillsStatistic implements JobOfferSkillsStatisticRawData {
    totalJobOffer: bigint
    skillCount: Map<string, bigint>

    constructor(totalJobOffer: bigint, skillCount: Map<string, bigint>) {
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
