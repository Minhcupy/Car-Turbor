import api from "./api"

// DTO cơ bản (UserResponseDTO)
export interface UserInfo {
    userName: string
    userEmail: string
    avatarUrl?: string | null
    roles: string[]
}

// DTO chi tiết (UserProfileDTO)
export interface UserProfile extends UserInfo {
    userFullName?: string | null
    userPhone?: string | null
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

/**
 * Update profile dạng JSON (không file) -> khớp controller hiện tại @RequestBody UpdateUserDTO
 */
export async function updateProfileJson(data: {
    userFullName?: string
    userPhone?: string
    avatarUrl?: string
}): Promise<UserInfo> {
    const res = await api.put<UserInfo>("/users/me", data, {
        headers: { "Content-Type": "application/json" },
    })
    return res.data
}

/**
 * Update profile + upload avatar -> endpoint mới /users/me/avatar (multipart)
 * khớp @RequestParam userFullName, userPhone và @RequestPart avatar
 */
export async function updateProfileWithAvatar(formData: FormData): Promise<UserInfo> {
    const res = await api.put<UserInfo>("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
}

// Xoá tài khoản (soft delete)
export async function deleteProfile(): Promise<string> {
    const res = await api.delete<string>("/users/me")
    return res.data
}
