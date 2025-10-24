import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./token";
import { refreshToken } from "./auth";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Gắn accessToken vào mỗi request
api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Xử lý khi gặp lỗi 401 → refresh token
let isRefreshing = false;
let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const rToken = getRefreshToken();
                if (!rToken) {
                    clearTokens();
                    window.location.href = "/user/login";
                    return Promise.reject(error);
                }

                // Gọi BE refresh token
                const res = await refreshToken(rToken);
                setTokens(res.accessToken, res.refreshToken);

                api.defaults.headers.common["Authorization"] = `Bearer ${res.accessToken}`;
                processQueue(null, res.accessToken);

                originalRequest.headers["Authorization"] = `Bearer ${res.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                clearTokens();
                window.location.href = "/user/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
