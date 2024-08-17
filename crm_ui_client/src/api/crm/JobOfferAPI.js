import {buildUrl} from "../utils/buildUrlQueryParams.js"
import {JobOffer} from "./dto/JobOffer.js"


const URL_JOB_OFFERS = 'http://localhost:8082/crm/api/joboffers'


async function GetJobOffers(filter, pagination) {
    const response = await fetch(
        buildUrl(URL_JOB_OFFERS, filter, pagination), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => JobOffer.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function GetJobOfferById(jobOfferId) {
    const response = await fetch(
        buildUrl(`${URL_JOB_OFFERS}/${jobOfferId}`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return JobOffer.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function GetJobOfferValue(jobOfferId) {
    const response = await fetch(
        buildUrl(`${URL_JOB_OFFERS}/${jobOfferId}/value`, null, null), {
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

async function InsertNewJobOffer(customerId, jobOffer) {
    const response = await fetch(
        buildUrl(`${URL_JOB_OFFERS}/${customerId}`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({jobOffer})
        })

    const obj = await response.json()

    if (response.ok) {
        return JobOffer.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateJobOffer(jobOfferId, updateJobOffer) {
    const response = await fetch(
        buildUrl(`${URL_JOB_OFFERS}/${jobOfferId}/status`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({updateJobOffer})
        })

    const obj = await response.json()

    if (response.ok) {
        return JobOffer.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteJobOffer(jobOfferId) {
    const response = await fetch(
        buildUrl(`${URL_JOB_OFFERS}/${jobOfferId}`, null, null), {
            method: 'DELETE',
            credentials: 'include'
        })

    const obj = await response.json()

    if (!response.ok) {
        throw obj
    }
}


const JobOfferAPI = {
    GetJobOffers,
    GetJobOfferById,
    GetJobOfferValue,
    InsertNewJobOffer,
    UpdateJobOffer,
    DeleteJobOffer
}

export default JobOfferAPI
