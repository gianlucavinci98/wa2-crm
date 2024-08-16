export enum Category {
    Customer, Professional, Unknown, CustomerProfessional
}

export class ContactFilter {
    name: string | null
    surname: string | null
    ssn: string | null
    category: Category | null
    address: string | null
    emailAddress: string | null
    telephoneNumber: string | null

    constructor(name: string | null,
                surname: string | null,
                ssn: string | null,
                category: Category | null,
                address: string | null,
                emailAddress: string | null,
                telephoneNumber: string | null) {
        this.name = name
        this.surname = surname
        this.ssn = ssn
        this.category = category
        this.address = address
        this.emailAddress = emailAddress
        this.telephoneNumber = telephoneNumber
    }
}
