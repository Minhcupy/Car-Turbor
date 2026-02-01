import api from "./api";

// ========== TYPES ==========

// Response khi verify otp (nhận JWT)
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    id: number;
    userName: string;
    roles: string[];
    // nếu BE còn trả token/type thì optional
    token?: string | null;
    type?: string;
}

// Response khi signin (gửi OTP)
export interface SignInOtpResponse {
    requiresOtp: boolean;
    otpToken: string;
    expiresIn: number;     // seconds
    maskedEmail?: string;
}

// Request khi verify OTP
export interface VerifyOtpRequest {
    otpToken: string;
    otp: string;
}

// Request khi register
export interface RegisterRequest {
    userName: string;
    email: string;
    password: string;
    userFullName: string;
    userPhone: string;
}

// Response khi register
export interface RegisterResponse {
    message: string;
}

// ========== AUTH APIs ==========

// 1) SIGNIN: check username/password -> gửi OTP -> trả otpToken
export const signinSendOtp = async (
    userName: string,
    password: string
): Promise<SignInOtpResponse> => {
    const res = await api.post<SignInOtpResponse>("/auth/signin", {
        userName,
        password,
    });
    return res.data;
};

// 2) VERIFY OTP: otpToken + otp -> trả access/refresh
export const verifyOtp = async (
    otpToken: string,
    otp: string
): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/verify-otp", {
        otpToken,
        otp,
    } satisfies VerifyOtpRequest);

    return res.data;
};

// REGISTER
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await api.post<RegisterResponse>("/auth/signup", data);
    return res.data;
};

// REFRESH TOKEN (giữ nguyên)
export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/refresh", { refreshToken });
    return res.data;
};

// CHECK EMAIL (giữ nguyên)
export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const res = await api.get<{ exists: boolean }>(`/auth/check-email`, {
            params: { email },
        });
        if (typeof res.data?.exists === "boolean") return res.data.exists;
        return true;
    } catch (err: any) {
        if (err?.response?.status === 404) return false;
        console.error("checkEmailExists error:", err);
        return false;
    }
};
