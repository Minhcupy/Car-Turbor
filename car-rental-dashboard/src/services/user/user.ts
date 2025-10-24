import api from "./api"

// DTO cơ bản (UserResponseDTO)
export interface UserInfo {
    userName: string
    userEmail: string
    avatarUrl?: string
    roles: string[]
}

// DTO chi tiết (UserProfileDTO)
export interface UserProfile extends UserInfo {
    userFullName?: string
    userPhone?: string
}

// Lấy thông tin cơ bản (header/nav)
export async function getCurrentUser(): Promise<UserInfo> {
    const res = await api.get<UserInfo>("/users/me")
    return res.data
}

// Lấy thông tin chi tiết profile (trang hồ sơ)
export async function getCurrentProfile(): Promise<UserProfile> {
    const res = await api.get<UserProfile>("/users/profile")
    return res.data
}

// Cập nhật thông tin profile
export async function updateProfile(data: Partial<UserProfile>): Promise<UserInfo> {
    const res = await api.put<UserInfo>("/users/me", data)
    return res.data
}

// Xoá tài khoản (soft delete)
export async function deleteProfile(): Promise<string> {
    const res = await api.delete<string>("/users/me")
    return res.data
}
