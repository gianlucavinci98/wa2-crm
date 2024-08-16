import {Category} from "../filter/ContactFilter";

interface ContactRawData {
    contactId: bigint
    name: string
    surname: string
    ssn: string
    category: Category
}

export class Contact implements ContactRawData {
    contactId: bigint
    name: string
    surname: string
    ssn: string
    category: Category

    constructor(contactId: bigint, name: string, surname: string, ssn: string, category: Category) {
        this.contactId = contactId
        this.name = name
        this.surname = surname
        this.ssn = ssn
        this.category = category
    }

    static fromJsonObject(obj: ContactRawData): Contact | undefined {
        try {
            return new Contact(obj.contactId, obj.name, obj.surname, obj.ssn, obj.category)
        } catch (e) {
            console.error(e)
            return undefined
        }
    }
}
