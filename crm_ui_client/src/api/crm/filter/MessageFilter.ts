export class MessageFilter {
    messageStatus: string | null

    constructor(messageStatus: number | null) {
        switch (messageStatus) {
            case 0:
                this.messageStatus = "Received"
                break
            case 1:
                this.messageStatus = "Read"
                break
            case 2:
                this.messageStatus = "Processing"
                break
            case 3:
                this.messageStatus = "Done"
                break
            case 4:
                this.messageStatus = "Discarded"
                break
            case 5:
                this.messageStatus = "Failed"
                break
            default:
                this.messageStatus = null
        }
    }
}