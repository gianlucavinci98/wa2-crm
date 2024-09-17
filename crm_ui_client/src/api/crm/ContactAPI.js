import {buildUrl} from "../utils/buildUrlQueryParams.js"
import {Contact} from "./dto/Contact.ts"
import {Address} from "./dto/Address.ts"
import {Email} from "./dto/Email.ts"
import {Telephone} from "./dto/Telephone.ts"
import {ContactDetails} from "./dto/ContactDetails.ts";


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
        return ContactDetails.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function InsertNewContact(contact, xsrfToken) {
    const response = await fetch(
        buildUrl(URL_CONTACTS, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify({contact})
        })

    const obj = await response.json()

    if (response.ok) {
        return Contact.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateContact(contact, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contact.contactId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(contact)
        })

    const obj = await response.json()

    if (response.ok) {
        return Contact.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteContact(contact, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contact.contactId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    const obj = await response.json()

    if (!response.ok) {
        throw obj
    }
}

async function InsertNewAddressToContact(contactId, address, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/address`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(new Address(null, address))
        })

    const obj = await response.json()

    if (response.ok) {
        return Address.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function InsertNewEmailToContact(contactId, email, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/email`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(new Email(null, email))
        })

    const obj = await response.json()

    if (response.ok) {
        return Email.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function InsertNewTelephoneToContact(contactId, telephone, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/telephone`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(new Telephone(null, telephone))
        })

    const obj = await response.json()

    if (response.ok) {
        return Telephone.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateAddressOfContact(contactId, addressId, address, xsrfToken) {
    console.log("CIAO: " + address)
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/address/${addressId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(new Address(addressId, address))
        })

    const obj = await response.json()

    if (response.ok) {
        return Address.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateEmailOfContact(contactId, emailId, email, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/email/${emailId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(new Email(emailId, email))
        })

    const obj = await response.json()

    if (response.ok) {
        return Email.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateTelephoneOfContact(contactId, telephoneId, telephone, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/telephone/${telephoneId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(new Telephone(telephoneId, telephone))
        })

    const obj = await response.json()

    if (response.ok) {
        return Telephone.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteAddressFromContact(contactId, addressId, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/address/${addressId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
    }
}

async function DeleteEmailFromContact(contactId, emailId, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/email/${emailId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
    }
}

async function DeleteTelephoneFromContact(contactId, telephoneId, xsrfToken) {
    const response = await fetch(
        buildUrl(`${URL_CONTACTS}/${contactId}/telephone/${telephoneId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
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
