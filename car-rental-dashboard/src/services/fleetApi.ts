import api from "./user/api"

// DTO thống kê tổng quan
export interface FleetOverview {
    totalCars: number
    rentedCars: number
    maintenanceCars: number
    utilization: number
}

export interface FleetCar {
    carId: number
    carName: string
    imageUrl: string
    location: string
    status: "AVAILABLE" | "RENTED" | "MAINTENANCE"
}

export interface CarLocation {
    carId: number
    carName: string
    latitude: number
    longitude: number
    status: "AVAILABLE" | "RENTED" | "MAINTENANCE"
}

// ✅ baseURL đã là http://localhost:8080/api trong api.ts
const API_URL = "/admin/fleet"

export const fleetApi = {
    getOverview: async (): Promise<FleetOverview> => {
        const res = await api.get<FleetOverview>(`${API_URL}/overview`)
        return res.data
    },

    getCars: async (): Promise<FleetCar[]> => {
        const res = await api.get<FleetCar[]>(`${API_URL}/cars`)
        return res.data
    },

    getTracking: async (): Promise<CarLocation[]> => {
        const res = await api.get<CarLocation[]>(`${API_URL}/tracking`)
        return res.data
    },

    updateCarLocation: async (
        carId: number,
        latitude: number,
        longitude: number
    ): Promise<CarLocation> => {
        const res = await api.put<CarLocation>(
            `${API_URL}/cars/${carId}/location`,
            null,
            { params: { latitude, longitude } }
        )
        return res.data
    },
}
