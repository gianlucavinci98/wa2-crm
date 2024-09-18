export class ContactFilter {
    name: string | null
    surname: string | null
    ssn: string | null
    category: String | null
    address: string | null
    emailAddress: string | null
    telephoneNumber: string | null

    constructor(name: string | null,
                surname: string | null,
                ssn: string | null,
                category: number | null,
                address: string | null,
                emailAddress: string | null,
                telephoneNumber: string | null) {
        this.name = name
        this.surname = surname
        this.ssn = ssn
        this.address = address
        this.emailAddress = emailAddress
        this.telephoneNumber = telephoneNumber

        switch (category) {
            case 0:
                this.category = "Customer"
                break
            case 1:
                this.category = "Professional"
                break
            case 2:
                this.category = "Unknown"
                break
            case 3:
                this.category = "CustomerProfessional"
                break
            default:
                this.category = null
        }
    }
}
