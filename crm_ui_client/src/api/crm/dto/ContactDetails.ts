import {Address} from "./Address";
import {Email} from "./Email";
import {Telephone} from "./Telephone";
import {Category} from "./Contact";

interface ContactDetailsRawData {
    contactId: bigint
    name: string
    surname: string
    ssn: string
    category: Category
    addresses: Address[]
    emails: Email[]
    telephones: Telephone[]
}

export class ContactDetails implements ContactDetailsRawData {
    contactId: bigint
    name: string
    surname: string
    ssn: string
    category: Category
    addresses: Address[]
    emails: Email[]
    telephones: Telephone[]

    constructor(contactId: bigint,
                name: string,
                surname: string,
                ssn: string,
                category: Category,
                addresses: Address[],
                emails: Email[],
                telephones: Telephone[]
    ) {
        this.contactId = contactId
        this.name = name
        this.surname = surname
        this.ssn = ssn
        this.category = category
        this.addresses = addresses
        this.emails = emails
        this.telephones = telephones
    }

    static fromJsonObject(obj: ContactDetailsRawData): ContactDetails | undefined {
        try {
            return new ContactDetails(
                obj.contactId,
                obj.name,
                obj.surname,
                obj.ssn,
                obj.category,
                obj.addresses,
                obj.emails,
                obj.telephones)
        } catch (e) {
            console.error(e)
            return undefined
        }
    }
}
