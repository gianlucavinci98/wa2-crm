interface DocumentMetadataRawData {
    metadataId: bigint
    name: string
    size: bigint
    contentType: string
    timestamp: string
}

export class DocumentMetadata implements DocumentMetadataRawData {
    metadataId: bigint
    name: string
    size: bigint
    contentType: string
    timestamp: string

    constructor(metadataId: bigint, name: string, size: bigint, contentType: string, timestamp: string) {
        this.metadataId = metadataId
        this.name = name
        this.size = size
        this.contentType = contentType
        this.timestamp = timestamp
    }

    static fromJsonObject(obj: DocumentMetadataRawData): DocumentMetadata | null {
        try {
            return new DocumentMetadata(obj.metadataId, obj.name, obj.size, obj.contentType, obj.timestamp)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
