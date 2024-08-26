import {DocumentCategory} from "../dto/DocumentMetadata"

export class DocumentMetadataFilter {
    category: DocumentCategory | null
    id: bigint | null

    constructor(category: DocumentCategory | null, id: bigint | null) {
        this.category = category
        this.id = id
    }
}
