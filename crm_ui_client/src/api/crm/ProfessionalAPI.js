import {buildUrl} from "../utils/buildUrlQueryParams.js"
import {Professional} from "./dto/Professional.ts";


const URL_PROFESSIONALS = 'http://localhost:8082/crm/api/professionals'


async function GetProfessionals(filter, pagination) {
    const response = await fetch(
        buildUrl(URL_PROFESSIONALS, null, pagination), {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
        })
    const obj = await response.json()

    if (response.ok) {
        console.log(obj)
        return obj.map((e) => Professional.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function GetProfessionalById(professionalId) {
    const response = await fetch(
        buildUrl(`${URL_PROFESSIONALS}/${professionalId}`, null, null), {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
        })
    const obj = await response.json()

    if (response.ok) {
        return Professional.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function InsertNewProfessional(contactId, professional, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_PROFESSIONALS}/${contactId}`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(professional)
        })

    const obj = await response.json()

    if (response.ok) {
        return Professional.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateProfessional(professional, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_PROFESSIONALS}/${professional.professionalId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(professional)
        })

    const obj = await response.json()

    if (response.ok) {
        return Professional.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteProfessional(professionalId, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_PROFESSIONALS}/${professionalId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
    }
}


const ProfessionalAPI = {
    GetProfessionals,
    GetProfessionalById,
    InsertNewProfessional,
    UpdateProfessional,
    DeleteProfessional
}

export default ProfessionalAPI
