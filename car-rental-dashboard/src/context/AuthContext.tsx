"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getAccessToken, clearTokens } from "@/src/services/user/token"
import { getCurrentUser } from "@/src/services/user/user"

export interface AuthState {
    isLoggedIn: boolean
    userName: string
    email?: string
    avatar?: string
    roles?: string[]
    accessToken?: string
}

interface AuthContextProps {
    auth: AuthState
    setAuth: (state: AuthState) => void
    logout: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextProps | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthState>({
        isLoggedIn: false,
        userName: "",
    })
    const [loading, setLoading] = useState(true)

    // Hàm logout chung
    const logout = useCallback(() => {
        clearTokens()
        setAuth({ isLoggedIn: false, userName: "" })
        window.location.href = "/user/login"
    }, [])

    // Kiểm tra token + load user khi mount
    useEffect(() => {
        const token = getAccessToken()

        if (!token) {
            setLoading(false)
            return
        }

        // 1) Có token => cho UI coi như đã đăng nhập trước
        setAuth((prev) => ({
            ...prev,
            isLoggedIn: true,
            accessToken: token,
        }))

        // 2) Sau đó mới fetch profile
        getCurrentUser()
            .then((res) => {
                setAuth({
                    isLoggedIn: true,
                    userName: res.userName ?? "",
                    email: res.userEmail,
                    avatar: res.avatarUrl,
                    roles: res.roles,
                    accessToken: token,
                })
            })
            .catch((err) => {
                // Nếu bạn muốn: chỉ logout khi chắc chắn token sai (401)
                // Nếu không bắt được status ở đây, tạm thời KHÔNG redirect gấp
                console.error("getCurrentUser failed:", err)

                // lựa chọn A: giữ đăng nhập nhưng thiếu profile
                setAuth((prev) => ({ ...prev, isLoggedIn: true }))

                // lựa chọn B: vẫn logout như cũ (cứng)
                // logout()
            })
            .finally(() => setLoading(false))
    }, [logout])


    return (
        <AuthContext.Provider value={{ auth, setAuth, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}
