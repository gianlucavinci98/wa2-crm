export enum Category {
    Customer, Professional, Unknown, CustomerProfessional
}

export interface ContactRawData {
    contactId: number | null
    name: string
    surname: string
    ssn: string
    category: Category | null
}

export class Contact implements ContactRawData {
    contactId: number | null
    name: string
    surname: string
    ssn: string
    category: Category | null

    constructor(contactId: number | null,
                name: string,
                surname: string,
                ssn: string,
                category: Category | null
    ) {
        this.contactId = contactId
        this.name = name
        this.surname = surname
        this.ssn = ssn
        this.category = category
    }

    static fromJsonObject(obj: ContactRawData): Contact | null {
        try {
            return new Contact(obj.contactId, obj.name, obj.surname, obj.ssn, obj.category)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
