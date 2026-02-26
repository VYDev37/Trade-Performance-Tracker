export interface LoginRequest {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token?: string;
}