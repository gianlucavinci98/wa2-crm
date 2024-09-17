import {MessageStatus} from "./MessageHistory";

export enum Channel {
    Address, Email, Telephone
}

interface MessageRawData {
    messageId: number | null
    sender: string
    date: string
    subject: string | null
    status: MessageStatus | null
    body: string | null
    channel: Channel
    priority: number | null
    hasAttachments: boolean | null
}

export class Message implements MessageRawData {
    messageId: number | null
    sender: string
    date: string
    subject: string | null
    status: MessageStatus | null
    body: string | null
    channel: Channel
    priority: number | null
    hasAttachments: boolean | null

    constructor(
        messageId: number | null,
        sender: string,
        date: string,
        subject: string | null,
        status: MessageStatus | null,
        body: string | null,
        channel: Channel,
        priority: number | null,
        hasAttachments: boolean | null
    ) {
        this.messageId = messageId
        this.sender = sender
        this.date = date
        this.subject = subject
        this.status = status
        this.body = body
        this.channel = channel
        this.priority = priority
        this.hasAttachments = hasAttachments
    }

    static fromJsonObject(obj: MessageRawData): Message | null {
        try {
            return new Message(
                obj.messageId,
                obj.sender,
                obj.date,
                obj.subject,
                obj.status,
                obj.body,
                obj.channel,
                obj.priority,
                obj.hasAttachments
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
