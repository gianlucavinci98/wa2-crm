import {DocumentCategory} from "../dto/DocumentMetadata"

export class DocumentMetadataFilter {
    category: string | null
    id: number | null

    constructor(category: number | null, id: number | null) {
        switch (category) {
            case 0:
                this.category = "Curriculum"
                break
            case 1:
                this.category = "Contract"
                break
            case 2:
                this.category = "Attachment"
                break
            case 3:
                this.category = "Unknown"
                break
            default:
                this.category = null
        }
        this.id = id
    }
}
