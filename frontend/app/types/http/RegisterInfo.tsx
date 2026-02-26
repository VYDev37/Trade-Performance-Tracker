export interface RegisterRequest {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
}