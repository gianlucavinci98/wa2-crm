export enum MessageStatus {
    Received,
    Read,
    Processing,
    Done,
    Discarded,
    Failed
}

interface MessageHistoryRawData {
    messageHistoryId: number | null
    messageStatus: MessageStatus
    date: string | null
    comment: string | null
}

export class MessageHistory implements MessageHistoryRawData {
    messageHistoryId: number | null
    messageStatus: MessageStatus
    date: string | null
    comment: string | null

    constructor(
        messageHistoryId: number | null,
        messageStatus: MessageStatus,
        date: string | null,
        comment: string | null
    ) {
        this.messageHistoryId = messageHistoryId
        this.messageStatus = messageStatus
        this.date = date
        this.comment = comment
    }

    static fromJsonObject(obj: MessageHistoryRawData): MessageHistory | null {
        try {
            return new MessageHistory(
                obj.messageHistoryId,
                obj.messageStatus,
                obj.date,
                obj.comment
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
