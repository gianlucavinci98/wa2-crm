import {buildUrl} from "../utils/buildUrlQueryParams.js"
import {Contact} from "./dto/Contact.ts"
import {Address} from "./dto/Address.ts"
import {Email} from "./dto/Email.ts"
import {Telephone} from "./dto/Telephone.ts"


const URL_CONTACTS = 'http://localhost:8082/crm/api/contacts'


async function GetContacts(filter, pagination) {
    const response = await fetch(
        buildUrl(URL_CONTACTS, filter, pagination), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => Contact.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function GetContactById(contactId) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return Contact.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function InsertNewContact(contact) {
    const response = await fetch(
        buildUrl(URL_CONTACTS, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({contact})
        })

    const obj = await response.json()

    if (response.ok) {
        return Contact.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateContact(contact) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contact.contactId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({contact})
        })

    const obj = await response.json()

    if (response.ok) {
        return Contact.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteContact(contact) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contact.contactId}`, null, null), {
            method: 'DELETE',
            credentials: 'include'
        })

    const obj = await response.json()

    if (!response.ok) {
        throw obj
    }
}

async function InsertNewAddressToContact(contactId, address) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/address`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({address})
        })

    const obj = await response.json()

    if (response.ok) {
        return Address.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function InsertNewEmailToContact(contactId, email) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/email`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
        })

    const obj = await response.json()

    if (response.ok) {
        return Email.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function InsertNewTelephoneToContact(contactId, telephone) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/telephone`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({telephone})
        })

    const obj = await response.json()

    if (response.ok) {
        return Telephone.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateAddressOfContact(contactId, addressId, address) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/address/${addressId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({address})
        })

    const obj = await response.json()

    if (response.ok) {
        return Address.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateEmailOfContact(contactId, emailId, email) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/email/${emailId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
        })

    const obj = await response.json()

    if (response.ok) {
        return Email.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateTelephoneOfContact(contactId, telephoneId, telephone) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/telephone/${telephoneId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({telephone})
        })

    const obj = await response.json()

    if (response.ok) {
        return Telephone.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteAddressFromContact(contactId, addressId) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/address/${addressId}`, null, null), {
            method: 'DELETE',
            credentials: 'include'
        })

    const obj = await response.json()

    if (!response.ok) {
        throw obj
    }
}

async function DeleteEmailFromContact(contactId, emailId) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/email/${emailId}`, null, null), {
            method: 'DELETE',
            credentials: 'include'
        })

    const obj = await response.json()

    if (!response.ok) {
        throw obj
    }
}

async function DeleteTelephoneFromContact(contactId, telephoneId) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/telephone/${telephoneId}`, null, null), {
            method: 'DELETE',
            credentials: 'include'
        })

    const obj = await response.json()

    if (!response.ok) {
        throw obj
    }
}


const ContactAPI = {
    GetContacts,
    GetContactById,
    InsertNewContact,
    UpdateContact,
    DeleteContact,
    InsertNewAddressToContact,
    InsertNewEmailToContact,
    InsertNewTelephoneToContact,
    UpdateAddressOfContact,
    UpdateEmailOfContact,
    UpdateTelephoneOfContact,
    DeleteAddressFromContact,
    DeleteEmailFromContact,
    DeleteTelephoneFromContact
}

export default ContactAPI
