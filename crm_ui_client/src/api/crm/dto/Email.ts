interface EmailRawData {
    emailId: bigint | null
    email: string
}

export class Email implements EmailRawData {
    emailId: bigint | null
    email: string

    constructor(emailId: bigint | null, email: string) {
        this.emailId = emailId
        this.email = email
    }

    static fromJsonObject(obj: EmailRawData): Email | null {
        try {
            return new Email(obj.emailId, obj.email)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
