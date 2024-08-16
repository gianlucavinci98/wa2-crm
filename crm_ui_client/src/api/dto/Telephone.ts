interface TelephoneRawData {
    telephoneId: bigint
    telephone: string
}

export class Telephone implements TelephoneRawData {
    telephoneId: bigint
    telephone: string

    constructor(telephoneId: bigint, telephone: string) {
        this.telephoneId = telephoneId
        this.telephone = telephone
    }

    static fromJsonObject(obj: TelephoneRawData): Telephone | undefined {
        try {
            return new Telephone(obj.telephoneId, obj.telephone)
        } catch (e) {
            console.error(e)
            return undefined
        }
    }
}
