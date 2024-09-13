import {Contact, ContactRawData} from "./Contact";

interface CustomerRawData {
    customerId: number | null
    notes: string[] | null
    contact: ContactRawData | null
}

export class Customer implements CustomerRawData {
    customerId: number | null
    notes: string[] | null
    contact: Contact | null

    constructor(customerId: number | null, notes: string[] | null, contact: Contact | null) {
        this.customerId = customerId
        this.notes = notes
        this.contact = contact
    }

    static fromJsonObject(obj: CustomerRawData): Customer | null {
        try {
            if (obj.contact ?? false) {
                return new Customer(obj.customerId, obj.notes, Contact.fromJsonObject(obj.contact!))
            } else {
                return new Customer(obj.customerId, obj.notes, null)
            }
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
