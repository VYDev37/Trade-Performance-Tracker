import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // reset
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;