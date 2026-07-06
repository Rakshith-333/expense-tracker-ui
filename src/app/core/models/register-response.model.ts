export interface RegisterResponse {
    success: string,
    message: string,
    data: RegisterData
}

export interface RegisterData {
    id: string,
    name: string,
    email: string
}