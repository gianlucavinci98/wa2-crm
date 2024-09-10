interface UserRawData {
    username: string
    name: string
    surname: string
    email: string
    loginUrl: string
    logoutUrl: string
    principal: string
    xsrfToken: string
    roles: string[]
}

export class User implements UserRawData {
    username: string
    name: string
    surname: string
    email: string
    loginUrl: string
    logoutUrl: string
    principal: string
    xsrfToken: string
    roles: string[]

    constructor(
        username: string,
        name: string,
        surname: string,
        email: string,
        loginUrl: string,
        logoutUrl: string,
        principal: string,
        xsrfToken: string,
        roles: string[]
    ) {
        this.username = username
        this.name = name
        this.surname = surname
        this.email = email
        this.loginUrl = loginUrl
        this.logoutUrl = logoutUrl
        this.principal = principal
        this.xsrfToken = xsrfToken
        this.roles = roles
    }

    static fromJsonObject(obj: UserRawData): User | null {
        try {
            return new User(
                obj.username,
                obj.name,
                obj.surname,
                obj.email,
                obj.loginUrl,
                obj.logoutUrl,
                obj.principal,
                obj.xsrfToken,
                obj.roles
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
