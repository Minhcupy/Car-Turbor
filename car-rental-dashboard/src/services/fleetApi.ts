import axios from "axios"

// DTO thống kê tổng quan
export interface FleetOverview {
    totalCars: number
    rentedCars: number
    maintenanceCars: number
    utilization: number
}

// DTO xe cơ bản (dùng cho list / grid)
export interface FleetCar {
    carId: number
    carName: string
    imageUrl: string
    location: string
    status: "AVAILABLE" | "RENTED" | "MAINTENANCE"
}

// DTO vị trí xe (dùng cho tracking map)
export interface CarLocation {
    carId: number
    carName: string
    latitude: number
    longitude: number
    status: "AVAILABLE" | "RENTED" | "MAINTENANCE"
}

const API_URL = "http://localhost:8080/api/admin/fleet"

export const fleetApi = {
    // 🔹 API thống kê tổng quan
    getOverview: async (): Promise<FleetOverview> => {
        const res = await axios.get<FleetOverview>(`${API_URL}/overview`)
        return res.data
    },

    // 🔹 API danh sách xe
    getCars: async (): Promise<FleetCar[]> => {
        const res = await axios.get<FleetCar[]>(`${API_URL}/cars`)
        return res.data
    },

    // 🔹 API danh sách vị trí xe (cho map tracking)
    getTracking: async (): Promise<CarLocation[]> => {
        const res = await axios.get<CarLocation[]>(`${API_URL}/tracking`)
        return res.data
    },

    // 🔹 API cập nhật vị trí xe (ví dụ: khi xe di chuyển)
    updateCarLocation: async (carId: number, latitude: number, longitude: number): Promise<CarLocation> => {
        const res = await axios.put<CarLocation>(
            `${API_URL}/cars/${carId}/location`,
            null,
            { params: { latitude, longitude } }
        )
        return res.data
    },
}
