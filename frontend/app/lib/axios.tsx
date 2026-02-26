import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: `http://${typeof window !== 'undefined' ? window.location.hostname : "localhost"}:8080/api`,
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