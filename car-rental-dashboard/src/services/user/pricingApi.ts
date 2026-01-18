import api from "./api"// axios instance đã gắn token (nếu user cần)

export type Pricing = {
    pricingId: number
    unit: string // "HOUR" | "DAY" | "WEEK" | "MONTH" ...
    price: number
    carId: number
}

// public/user endpoint (không phải admin)
export const userPricingApi = {
    getByCar: async (carId: number): Promise<Pricing[]> => {
        const res = await api.get<Pricing[]>(`/pricing/car/${carId}`)
        return res.data
    },
}
