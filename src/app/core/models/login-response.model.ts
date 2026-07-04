export interface LoginResponse {
    success: string,
    message: string,
    data: LoginData
}

export interface LoginData {
    token: string,
    user: User
}

export interface User {
    id: string,
    name: string,
    email: string
}