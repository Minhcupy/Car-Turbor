import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./token"

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api").replace(/\/$/, "")

type FetchOpts = RequestInit & { retry?: boolean }

export async function authFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
    const url = path.startsWith("http") ? path : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`

    const accessToken = getAccessToken()
    const headers = new Headers(opts.headers || {})

    // Nếu body là FormData thì KHÔNG set Content-Type JSON
    const isFormData = typeof FormData !== "undefined" && opts.body instanceof FormData
    if (!isFormData) headers.set("Content-Type", "application/json")

    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`)

    const res = await fetch(url, {
        ...opts,
        headers,
    })

    if (res.ok) {
        // nếu trả về rỗng (204) thì tránh .json() lỗi
        const text = await res.text()
        return (text ? JSON.parse(text) : null) as T
    }

    // 401 -> refresh 1 lần
    if (res.status === 401 && !opts.retry) {
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
            clearTokens()
            throw new Error("Hết phiên đăng nhập. Vui lòng đăng nhập lại.")
        }

        const r = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        })

        if (!r.ok) {
            clearTokens()
            throw new Error("Refresh token không hợp lệ. Vui lòng đăng nhập lại.")
        }

        const data = await r.json()
        setTokens(data.accessToken, data.refreshToken)

        return authFetch<T>(path, { ...opts, retry: true })
    }

    const errorText = await res.text().catch(() => "")
    throw new Error(errorText || `Request failed: ${res.status}`)
}
