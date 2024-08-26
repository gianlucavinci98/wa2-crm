import {Contact, ContactRawData} from "./Contact";
import {Application, ApplicationRawData} from "./Application";

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
    candidates: Set<ApplicationRawData>
}

export class Professional implements ProfessionalRawData {
    professionalId: bigint | null
    skills: Set<string>
    employmentState: EmploymentState | null
    dailyRate: number
    location: string
    contact: ContactRawData | null
    candidates: Set<Application>

    constructor(
        professionalId: bigint | null,
        skills: Set<string>,
        employmentState: EmploymentState | null,
        dailyRate: number, location: string,
        contact: ContactRawData | null,
        candidates: Set<Application>
    ) {
        this.professionalId = professionalId
        this.skills = skills
        this.employmentState = employmentState
        this.dailyRate = dailyRate
        this.location = location
        this.contact = contact
        this.candidates = candidates
    }

    static fromJsonObject(obj: ProfessionalRawData): Professional | null {
        try {
            const tmp: Array<Application> = Array.from(obj.candidates.values()).map((e: ApplicationRawData) => Application.fromJsonObject(e)!)
            const candidates: Set<Application> | null = new Set()

            tmp.forEach((e: Application) => {
                candidates.add(e)
            })

            if (obj.contact ?? false) {
                return new Professional(
                    obj.professionalId,
                    obj.skills,
                    obj.employmentState,
                    obj.dailyRate,
                    obj.location,
                    Contact.fromJsonObject(obj.contact!),
                    candidates
                )
            } else {
                return new Professional(
                    obj.professionalId,
                    obj.skills,
                    obj.employmentState,
                    obj.dailyRate,
                    obj.location,
                    null,
                    candidates
                )
            }
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
