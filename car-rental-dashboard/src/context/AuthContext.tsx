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

        getCurrentUser()
            .then((res) => {
                setAuth({
                    isLoggedIn: true,
                    userName: res.userName,
                    email: res.userEmail,
                    avatar: res.avatarUrl,
                    roles: res.roles,
                })
            })
            .catch(() => {
                logout()
            })
            .finally(() => {
                setLoading(false)
            })
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
