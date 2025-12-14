// src/services/pricingApi.ts
import axios from "axios"

export type Pricing = {
    pricingId: number
    unit: string          // "DAY" | "HOUR" | ...
    price: number
    carId: number
}

const API_URL = "http://localhost:8080/api/admin/pricing"

export const pricingApi = {
    // Lấy tất cả pricing của 1 car
    getByCar: async (carId: number): Promise<Pricing[]> => {
        const res = await axios.get<Pricing[]>(`${API_URL}/car/${carId}`)
        return res.data
    },

    // Tạo pricing mới
    create: async (data: Omit<Pricing, "pricingId">): Promise<Pricing> => {
        const res = await axios.post<Pricing>(API_URL, data)
        return res.data
    },

    // Cập nhật pricing
    update: async (id: number, data: Omit<Pricing, "pricingId">): Promise<Pricing> => {
        const res = await axios.put<Pricing>(`${API_URL}/${id}`, data)
        return res.data
    },

    // Xoá pricing
    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`)
    },
}
