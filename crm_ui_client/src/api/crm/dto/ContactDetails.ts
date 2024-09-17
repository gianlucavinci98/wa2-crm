import {Address} from "./Address";
import {Email} from "./Email";
import {Telephone} from "./Telephone";
import {Category} from "./Contact";

interface ContactDetailsRawData {
    contactId: number
    name: string
    surname: string
    ssn: string
    category: Category
    addresses: Address[]
    emails: Email[]
    telephones: Telephone[],
    professionalId: number | null,
    customerId: number | null
}

export class ContactDetails implements ContactDetailsRawData {
    contactId: number
    name: string
    surname: string
    ssn: string
    category: Category
    addresses: Address[]
    emails: Email[]
    telephones: Telephone[]
    professionalId: number | null
    customerId: number | null

    constructor(contactId: number,
                name: string,
                surname: string,
                ssn: string,
                category: Category,
                addresses: Address[],
                emails: Email[],
                telephones: Telephone[],
                professionalId: number | null,
                customerId: number | null
    ) {
        this.contactId = contactId
        this.name = name
        this.surname = surname
        this.ssn = ssn
        this.category = category
        this.addresses = addresses
        this.emails = emails
        this.telephones = telephones
        this.professionalId = professionalId
        this.customerId = customerId
    }

    static fromJsonObject(obj: ContactDetailsRawData): ContactDetails | undefined {
        try {
            return new ContactDetails(
                obj.contactId,
                obj.name,
                obj.surname,
                obj.ssn,
                obj.category,
                obj.addresses.map(e => new Address(e.addressId, e.address)),
                obj.emails.map(e => new Email(e.emailId, e.emailAddress)),
                obj.telephones.map(e => new Telephone(e.telephoneId, e.telephoneNumber)),
                obj.professionalId,
                obj.customerId
            )
        } catch (e) {
            console.error(e)
            return undefined
        }
    }
}
