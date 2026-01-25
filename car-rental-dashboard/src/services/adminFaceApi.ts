import api from "./user/api"

export interface AdminFaceDTO {
    userId: number
    registered: boolean
    model?: string
    dim?: number
    version?: string
    qualityScore?: number
    createdAt?: string
}

export async function getCustomerFace(userId: number) {
    const res = await api.get<AdminFaceDTO>(`/admin/faces/${userId}`)
    return res.data
}

export async function resetCustomerFace(userId: number) {
    await api.delete(`/admin/faces/${userId}`)
}
