interface EmailRawData {
    emailId: bigint
    email: string
}

export class Email implements EmailRawData {
    emailId: bigint
    email: string

    constructor(emailId: bigint, email: string) {
        this.emailId = emailId
        this.email = email
    }

    static fromJsonObject(obj: EmailRawData): Email | undefined {
        try {
            return new Email(obj.emailId, obj.email)
        } catch (e) {
            console.error(e)
            return undefined
        }
    }
}
