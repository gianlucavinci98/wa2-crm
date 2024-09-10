import {EmploymentState} from "../dto/Professional";


export class ProfessionalFilter {
    skills: string[] | null
    location: string | null
    employmentState: EmploymentState | null

    constructor(skills: string[] | null, employmentState: EmploymentState | null, location: string | null) {
        this.skills = skills
        this.location = location
        this.employmentState = employmentState
    }
}
