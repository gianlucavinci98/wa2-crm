export enum Category {
    Customer, Professional, Unknown, CustomerProfessional
}

export class ContactFilter {
    name: string
    surname: string
    ssn: string
    category: Category
    address: string
    emailAddress: string
    telephoneNumber: string

    constructor(name: string,
                surname: string,
                ssn: string,
                category: Category,
                address: string,
                emailAddress: string,
                telephoneNumber: string) {
        this.name = name
        this.surname = surname
        this.ssn = ssn
        this.category = category
        this.address = address
        this.emailAddress = emailAddress
        this.telephoneNumber = telephoneNumber
    }
}
