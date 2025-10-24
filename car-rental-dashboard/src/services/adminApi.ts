// src/services/adminApi.ts
import api from "./user/api"

// Page response chung
export interface PageResponse<T> {
    content: T[]
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
}

export const adminApi = {
    // GET danh sách có phân trang
    getPage: async <T>(
        resource: string,
        params?: Record<string, any>
    ): Promise<PageResponse<T>> => {
        const res = await api.get<PageResponse<T>>(`${resource}`, { params })
        return res.data
    },

    // GET toàn bộ
    getAll: async <T>(resource: string): Promise<T[]> => {
        const res = await api.get<T[]>(`${resource}`)
        return res.data
    },

    // GET chi tiết theo id
    getById: async <T>(resource: string, id: number | string): Promise<T> => {
        const res = await api.get<T>(`${resource}/${id}`)
        return res.data
    },

    // POST tạo mới
    create: async <T>(resource: string, data: any): Promise<T> => {
        const res = await api.post<T>(`${resource}`, data)
        return res.data
    },

    // PUT cập nhật
    update: async <T>(resource: string, id: number | string, data: any): Promise<T> => {
        const res = await api.put<T>(`${resource}/${id}`, data)
        return res.data
    },

    // DELETE
    delete: async (resource: string, id: number | string): Promise<void> => {
        await api.delete(`${resource}/${id}`)
    },
}
