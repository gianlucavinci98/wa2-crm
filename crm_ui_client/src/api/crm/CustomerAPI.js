import {buildUrl} from "../utils/buildUrlQueryParams.js"
import {Customer} from "./dto/Customer.ts"


const URL_CUSTOMERS = 'http://localhost:8082/crm/api/customers'


async function GetCustomers(filter, pagination) {
    const response = await fetch(
        buildUrl(URL_CUSTOMERS, null, pagination), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => Customer.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function GetCustomerById(customerId) {
    const response = await fetch(
        buildUrl(`${URL_CUSTOMERS}/${customerId}`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return Customer.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function InsertNewCustomer(contactId, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CUSTOMERS}/${contactId}`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify({})
        })

    const obj = await response.json()

    if (response.ok) {
        return Customer.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteCustomer(customerId, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CUSTOMERS}/${customerId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
    }
}

async function InsertNewNoteToCustomer(customerId, note, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CUSTOMERS}/${customerId}/notes`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: note
        })

    const obj = await response.json()

    if (response.ok) {
        return Customer.fromJsonObject(obj)
    } else {
        throw obj
    }
}


const CustomerAPI = {
    GetCustomers,
    GetCustomerById,
    InsertNewCustomer,
    DeleteCustomer,
    InsertNewNoteToCustomer
}

export default CustomerAPI
