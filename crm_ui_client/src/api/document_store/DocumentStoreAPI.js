import {buildUrl} from "../utils/buildUrlQueryParams.js"
import {DocumentMetadata} from "./dto/DocumentMetadata.js"


const URL_DOCUMENT_STORE = 'http://localhost:8083/document-store/api/contacts'


async function GetDocuments(pagination) {
    const response = await fetch(
        buildUrl(URL_DOCUMENT_STORE, null, pagination), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => DocumentMetadata.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function GetDocumentMetadataById(documentMetadataId) {
    const response = await fetch(
        buildUrl(`${URL_DOCUMENT_STORE}/${documentMetadataId}`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return DocumentMetadata.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function GetDocumentDataById(documentMetadataId) {
    const response = await fetch(
        buildUrl(`${URL_DOCUMENT_STORE}/${documentMetadataId}/data`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function InsertNewDocument(file) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(
        buildUrl(URL_DOCUMENT_STORE, null, null), {
            method: 'POST',
            credentials: 'include',
            body: formData
        })

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function UpdateDocument(documentMetadataId, file) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(
        buildUrl(`${URL_DOCUMENT_STORE}/${documentMetadataId}`, null, null), {
            method: 'POST',
            credentials: 'include',
            body: formData
        })

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function DeleteDocument(documentMetadataId) {
    const response = await fetch(
        buildUrl(`${URL_DOCUMENT_STORE}/${documentMetadataId}`, null, null), {
            method: 'DELETE',
            credentials: 'include'
        })

    const obj = await response.json()

    if (!response.ok) {
        throw obj
    }
}


const DocumentStoreAPI = {
    GetDocuments,
    GetDocumentMetadataById,
    GetDocumentDataById,
    InsertNewDocument,
    UpdateDocument,
    DeleteDocument
}

export default DocumentStoreAPI
