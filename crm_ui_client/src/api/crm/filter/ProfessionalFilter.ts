import {EmploymentState} from "../dto/Professional";


export class ProfessionalFilter {
    skills: Set<string> | null
    location: string | null
    employmentState: EmploymentState | null

    constructor(skills: Set<string> | null, employmentState: EmploymentState | null, location: string | null) {
        this.skills = skills
        this.location = location
        this.employmentState = employmentState
    }
}
