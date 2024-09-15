import {buildUrl} from "../utils/buildUrlQueryParams.js"
import {DocumentMetadata} from "./dto/DocumentMetadata.ts"


const URL_DOCUMENT_STORE = 'http://localhost:8082/document-store/api/documents'


async function GetDocuments(filter, pagination) {
    const response = await fetch(
        buildUrl(URL_DOCUMENT_STORE, filter, pagination), {
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

async function InsertNewDocument(file, xsrfToken) {
    const response = await fetch(
        buildUrl(URL_DOCUMENT_STORE, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'X-XSRF-TOKEN': xsrfToken}
        })

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function UpdateDocument(documentMetadataId, file, xsrfToken) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(
        buildUrl(`${URL_DOCUMENT_STORE}/${documentMetadataId}`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'X-XSRF-TOKEN': xsrfToken},
            body: formData
        })

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function DeleteDocument(documentMetadataId, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_DOCUMENT_STORE}/${documentMetadataId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
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
