export enum Channel {
    Address, Email, Telephone
}

interface MessageRawData {
    messageId: number | null
    sender: string
    date: string
    subject: string | null
    body: string | null
    channel: Channel
    priority: number | null
}

export class Message implements MessageRawData {
    messageId: number | null
    sender: string
    date: string
    subject: string | null
    body: string | null
    channel: Channel
    priority: number | null

    constructor(
        messageId: number | null,
        sender: string,
        date: string,
        subject: string | null,
        body: string | null,
        channel: Channel,
        priority: number | null,
    ) {
        this.messageId = messageId
        this.sender = sender
        this.date = date
        this.subject = subject
        this.body = body
        this.channel = channel
        this.priority = priority
    }

    static fromJsonObject(obj: MessageRawData): Message | null {
        try {
            return new Message(
                obj.messageId,
                obj.sender,
                obj.date,
                obj.subject,
                obj.body,
                obj.channel,
                obj.priority
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
