import {buildUrl} from "../utils/buildUrlQueryParams.js"
import {DocumentMetadata} from "./dto/DocumentMetadata.ts"
import {DocumentDTO} from "./dto/DocumentDTO.ts";
import {convertFileToBase64} from "../utils/converterFileToBase64.js";


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

async function InsertNewDocument(file, category, id, xsrfToken) {
    const base64File = await convertFileToBase64(file)
    const documentDTO = new DocumentDTO(file.name, file.size, base64File.split(';')[0].split(':')[1], category, id, base64File.split(',')[1])

    const response = await fetch(
        buildUrl(URL_DOCUMENT_STORE, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(documentDTO)
        })

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function UpdateDocument(documentMetadataId, file, category, id, xsrfToken) {
    const base64File = await convertFileToBase64(file)
    const documentDTO = new DocumentDTO(file.name, file.size, base64File.split(';')[0].split(':')[1], category, id, base64File.split(',')[1])

    const response = await fetch(
        buildUrl(`${URL_DOCUMENT_STORE}/${documentMetadataId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(documentDTO)
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
