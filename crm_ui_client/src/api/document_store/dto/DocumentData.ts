interface DocumentDataRawData {
    documentId: number
    data: Uint8Array
}

export class DocumentData implements DocumentDataRawData {
    documentId: number
    data: Uint8Array

    constructor(documentId: number, data: Uint8Array) {
        this.documentId = documentId
        this.data = data
    }

    static fromJsonObject(obj: DocumentDataRawData): DocumentData | null {
        try {
            return new DocumentData(obj.documentId, obj.data)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
