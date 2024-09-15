import {DocumentCategory} from "../dto/DocumentMetadata"

export class DocumentMetadataFilter {
    category: DocumentCategory | null
    id: number | null

    constructor(category: DocumentCategory | null, id: number | null) {
        this.category = category
        this.id = id
    }
}
