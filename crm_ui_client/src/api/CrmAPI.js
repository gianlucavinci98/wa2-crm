import {buildUrl} from "./filter/buildUrlQueryParams.js";
import {Contact} from "./dto/Contact.js";

const URL_CONTACTS = 'http://localhost:8082/crm/api/contacts';

/*const URL_CUSTOMERS = 'http://localhost:8082/crm/api/customers';
const URL_PROFESSIONALS = 'http://localhost:8082/crm/api/professionals';
const URL_JOB_OFFERS = 'http://localhost:8082/crm/api/joboffers';
const URL_MESSAGES = 'http://localhost:8082/crm/api/messages';*/

async function GetContacts(filter, pagination) {
    const response = await fetch(buildUrl(URL_CONTACTS, filter, pagination), {credentials: 'include'});
    const contacts = await response.json();

    if (response.ok) {
        return contacts.map((e) => Contact.fromJsonObject(e))
    } else {
        throw contacts;
    }
}

const CrmAPI = {GetContacts}

export default CrmAPI
