import axios from "axios"
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./token"
import { refreshToken } from "./auth"

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    // ❌ KHÔNG set Content-Type mặc định
})

// ===== Request interceptor =====
api.interceptors.request.use((config: any) => {
    const token = getAccessToken()
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }

    // ✅ Xử lý Content-Type đúng cho FormData
    const isFormData =
        typeof FormData !== "undefined" && config.data instanceof FormData

    config.headers = config.headers || {}

    if (isFormData) {
        // để axios tự set multipart/form-data; boundary=...
        if (config.headers["Content-Type"]) {
            delete config.headers["Content-Type"]
        }
    } else {
        // request JSON bình thường
        if (!config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "application/json"
        }
    }

    return config
})

// ===== Refresh token queue =====
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null) => {
    failedQueue.forEach((p) => {
        if (error) p.reject(error)
        else p.resolve(token)
    })
    failedQueue = []
}

// ===== Response interceptor =====
api.interceptors.response.use(
    (response) => response,
    async (error: any) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return api(originalRequest)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const rToken = getRefreshToken()
                if (!rToken) {
                    clearTokens()
                    window.location.href = "/user/login"
                    return Promise.reject(error)
                }

                const res = await refreshToken(rToken)
                setTokens(res.accessToken, res.refreshToken)

                api.defaults.headers.common.Authorization = `Bearer ${res.accessToken}`
                processQueue(null, res.accessToken)

                originalRequest.headers.Authorization = `Bearer ${res.accessToken}`
                return api(originalRequest)
            } catch (err) {
                processQueue(err, null)
                clearTokens()
                window.location.href = "/user/login"
                return Promise.reject(err)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default api
