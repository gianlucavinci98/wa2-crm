interface TelephoneRawData {
    telephoneId: number | null
    telephoneNumber: string
}

export class Telephone implements TelephoneRawData {
    telephoneId: number | null
    telephoneNumber: string

    constructor(telephoneId: number | null, telephoneNumber: string) {
        this.telephoneId = telephoneId
        this.telephoneNumber = telephoneNumber
    }

    static fromJsonObject(obj: TelephoneRawData): Telephone | null {
        try {
            return new Telephone(obj.telephoneId, obj.telephoneNumber)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
