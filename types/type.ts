
export type jwtUser = {
    id: string
    firstName: string
    lastName: string
    email: string
}

export type jwtuserContext = {
    user?: jwtUser
}