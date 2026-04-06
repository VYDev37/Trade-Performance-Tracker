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
    async (error) => {
        if (error.response?.status === 401) {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // reset
            if (window.location.pathname !== "/login")
                window.location.href = "/login";
            return Promise.reject(new Error("Session expired. Please login again."));
        }

        if (axios.isAxiosError(error)) {
            const customMessage = error.response?.data?.message || error.message || 'Something went wrong.';
            return Promise.reject(new Error(customMessage));
        }
        return Promise.reject(new Error('Unexpected error occurred.'));
    }
);

export default api;