/**
 * This enum is used to specify the relation of the `id` field
 * of `DocumentMetadata` class with the `crm microservice` entities
 *
 * These are the relations between the enum values and the `id` field:
 *
 * - `Curriculum`: the `id` field is related to a `Professional`
 * - `Contract`: the `id` field is related to a `JobOffer`
 * - `Attachment`: the `id` field is related to a `Message`
 * - `Unknown`: the document is not related to any other entity
 * */
export enum DocumentCategory {
    Curriculum,
    Contract,
    Attachment,
    Unknown
}

interface DocumentMetadataRawData {
    metadataId: number
    name: string
    size: number
    contentType: string
    timestamp: string
    category: DocumentCategory
    id: number
}

export class DocumentMetadata implements DocumentMetadataRawData {
    metadataId: number
    name: string
    size: number
    contentType: string
    timestamp: string
    category: DocumentCategory
    id: number

    constructor(
        metadataId: number,
        name: string,
        size: number,
        contentType: string,
        timestamp: string,
        category: DocumentCategory,
        id: number
    ) {
        this.metadataId = metadataId
        this.name = name
        this.size = size
        this.contentType = contentType
        this.timestamp = timestamp
        this.category = category
        this.id = id
    }

    static fromJsonObject(obj: DocumentMetadataRawData): DocumentMetadata | null {
        try {
            return new DocumentMetadata(obj.metadataId, obj.name, obj.size, obj.contentType, obj.timestamp, obj.category, obj.id)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
