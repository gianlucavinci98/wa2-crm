import {DocumentCategory} from "./DocumentMetadata";

export class DocumentDTO {
    name: string
    size: number
    contentType: string
    category: DocumentCategory
    id: number | null
    data: string

    constructor(
        name: string,
        size: number,
        contentType: string,
        category: DocumentCategory,
        id: number | null,
        data: string
    ) {
        this.name = name
        this.size = size
        this.contentType = contentType
        this.category = category
        this.id = id
        this.data = data
    }
}