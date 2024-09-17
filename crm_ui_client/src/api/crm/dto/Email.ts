interface EmailRawData {
    emailId: number | null
    emailAddress: string
}

export class Email implements EmailRawData {
    emailId: number | null
    emailAddress: string

    constructor(emailId: number | null, emailAddress: string) {
        this.emailId = emailId
        this.emailAddress = emailAddress
    }

    static fromJsonObject(obj: EmailRawData): Email | null {
        try {
            return new Email(obj.emailId, obj.emailAddress)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
