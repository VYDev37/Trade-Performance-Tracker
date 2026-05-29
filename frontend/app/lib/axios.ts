import axios from "axios";

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
        const isLoginPath = window.location.pathname === "/login";
        const isLoginRequest = error.config.url.includes("/account/login");

        if (error.response?.status === 401 && !isLoginPath && !isLoginRequest) {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
            return Promise.reject(new Error("Session expired. Please login again."));
        }

        const customMessage = error.response?.data?.message || error.message;
        return Promise.reject(new Error(customMessage));
    }
);

export default api;