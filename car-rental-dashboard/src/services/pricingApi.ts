// src/services/pricingApi.ts
import api from "./user/api"

export type Pricing = {
    pricingId: number
    unit: string
    price: number
    carId: number
}

export const pricingApi = {
    getByCar: async (carId: number): Promise<Pricing[]> => {
        const res = await api.get<Pricing[]>(`/admin/pricing/car/${carId}`)
        return res.data
    },

    create: async (data: Omit<Pricing, "pricingId">): Promise<Pricing> => {
        const res = await api.post<Pricing>(`/admin/pricing`, data)
        return res.data
    },

    update: async (
        id: number,
        data: Omit<Pricing, "pricingId">
    ): Promise<Pricing> => {
        const res = await api.put<Pricing>(`/admin/pricing/${id}`, data)
        return res.data
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/admin/pricing/${id}`)
    },
}
