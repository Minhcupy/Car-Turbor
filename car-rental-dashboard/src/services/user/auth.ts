import api from "./api";

// Response khi login
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    id: number;
    userName: string;   // giữ đúng kiểu BE trả về
    roles: string[];
}

// Request khi register
export interface RegisterRequest {
    userName: string;       // giữ đúng với BE DTO
    email: string;
    password: string;
    userFullName: string;
    userPhone: string;
}

// Response khi register
export interface RegisterResponse {
    message: string;
}

// 👉 Hàm set token + user info vào localStorage
export const setTokens = (accessToken: string, refreshToken: string, userName?: string) => {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    if (userName) localStorage.setItem("userName", userName)
}

export const clearTokens = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userName")
}

export const getAccessToken = () => {
    return localStorage.getItem("accessToken")
}


// ----------------- LOGIN -----------------
export const login = async (
    userName: string,
    password: string
): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/signin", {
        userName,   // đúng key BE (SignInRequest)
        password,
    });
    return res.data;
};

// ----------------- REGISTER -----------------
export const register = async (
    data: RegisterRequest
): Promise<RegisterResponse> => {
    const res = await api.post<RegisterResponse>("/auth/signup", data);
    return res.data;
};

// ----------------- REFRESH TOKEN -----------------
export const refreshToken = async (
    refreshToken: string
): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/refresh", { refreshToken });
    return res.data;
};
export const checkEmailExists = async (email: string): Promise<boolean> => {
    // BE nên trả { exists: boolean } hoặc HTTP 200/404. Ta xử lý cả hai.
    try {
        const res = await api.get<{ exists: boolean }>(`/auth/check-email`, {
            params: { email },
        })
        if (typeof res.data?.exists === "boolean") return res.data.exists
        // fallback: nếu BE trả 200 là tồn tại
        return true
    } catch (err: any) {
        // nếu BE trả 404 (không tồn tại) -> coi như false
        if (err?.response?.status === 404) return false
        // các lỗi khác coi như không tồn tại để không chặn đăng ký, nhưng nên log
        console.error("checkEmailExists error:", err)
        return false
    }

}
