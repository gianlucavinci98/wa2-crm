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
        if (name?.trim() === "") {
            this.name = null
        } else {
            this.name = name
        }
        if (surname?.trim() === "") {
            this.surname = null
        } else {
            this.surname = surname
        }
        if (ssn?.trim() === "") {
            this.ssn = null
        } else {
            this.ssn = ssn
        }
        if (address?.trim() === "") {
            this.address = null
        } else {
            this.address = address
        }
        if (emailAddress?.trim() === "") {
            this.emailAddress = null
        } else {
            this.emailAddress = emailAddress
        }
        if (telephoneNumber?.trim() === "") {
            this.telephoneNumber = null
        } else {
            this.telephoneNumber = telephoneNumber
        }

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
