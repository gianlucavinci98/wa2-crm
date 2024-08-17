import {Contact, ContactRawData} from "./Contact";

export enum EmploymentState {
    Employed, Unemployed, NotAvailable
}

interface ProfessionalRawData {
    professionalId: bigint | null
    skills: Set<string>
    employmentState: EmploymentState | null
    dailyRate: number
    location: string
    contact: ContactRawData | null
}

export class Professional implements ProfessionalRawData {
    professionalId: bigint | null
    skills: Set<string>
    employmentState: EmploymentState | null
    dailyRate: number
    location: string
    contact: ContactRawData | null

    constructor(
        professionalId: bigint | null,
        skills: Set<string>,
        employmentState: EmploymentState | null,
        dailyRate: number, location: string,
        contact: ContactRawData | null
    ) {
        this.professionalId = professionalId
        this.skills = skills
        this.employmentState = employmentState
        this.dailyRate = dailyRate
        this.location = location
        this.contact = contact
    }

    static fromJsonObject(obj: ProfessionalRawData): Professional | null {
        try {
            if (obj.contact ?? false) {
                return new Professional(
                    obj.professionalId,
                    obj.skills,
                    obj.employmentState,
                    obj.dailyRate,
                    obj.location,
                    Contact.fromJsonObject(obj.contact!)
                )
            } else {
                return new Professional(
                    obj.professionalId,
                    obj.skills,
                    obj.employmentState,
                    obj.dailyRate,
                    obj.location,
                    null
                )
            }
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
