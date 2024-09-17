export enum Category {
    Customer, Professional, Unknown, CustomerProfessional
}

export interface ContactRawData {
    contactId: number | null
    name: string
    surname: string
    ssn: string
    category: Category | null
    professionalId: number |null
    customerId: number |null
}

export class Contact implements ContactRawData {
    contactId: number | null
    name: string
    surname: string
    ssn: string
    category: Category | null
    professionalId: number |null
    customerId: number |null


    constructor(contactId: number | null,
                name: string,
                surname: string,
                ssn: string,
                category: Category | null,
                professionalId: number |null,
                customerId: number |null) {
        this.contactId = contactId
        this.name = name
        this.surname = surname
        this.ssn = ssn
        this.category = category
        this.professionalId = professionalId
        this.customerId = customerId
    }

    static fromJsonObject(obj: ContactRawData): Contact | null {
        try {
            return new Contact(obj.contactId, obj.name, obj.surname, obj.ssn, obj.category, obj.professionalId, obj.customerId)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
