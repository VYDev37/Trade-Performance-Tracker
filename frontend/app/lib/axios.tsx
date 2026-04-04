import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message: string }>) => {
        if (error.response && error.response.data && error.response.data.message) {
            error.message = error.response.data.message;
        }
        return Promise.reject(error);
    }
);

export default api;