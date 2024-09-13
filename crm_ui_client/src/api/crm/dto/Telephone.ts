interface TelephoneRawData {
    telephoneId: number | null
    telephone: string
}

export class Telephone implements TelephoneRawData {
    telephoneId: number | null
    telephone: string

    constructor(telephoneId: number | null, telephone: string) {
        this.telephoneId = telephoneId
        this.telephone = telephone
    }

    static fromJsonObject(obj: TelephoneRawData): Telephone | null {
        try {
            return new Telephone(obj.telephoneId, obj.telephone)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
