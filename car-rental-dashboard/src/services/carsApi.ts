// src/services/carsApi.ts
import axios from "axios"

const API_URL = "http://localhost:8080/api/cars"

function getAuthHeader() {
    if (typeof window === "undefined") return {}
    const token = localStorage.getItem("accessToken")   // 👈 sửa lại key nếu bạn dùng key khác
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export type Car = {
    id: number
    carName: string
    status: "AVAILABLE" | "RENTED" | "MAINTENANCE"
    quantity: number
    location: string
    createdDate: string
    engine: string
    fuelType: string
    seatCount: number
    year: number
    color: string
    licensePlate: string
    brandId: number
    brandName: string
    carTypeId: number
    carTypeName: string
    primaryImage: string
    imageUrls: string[]
}

export type CarPage = {
    content: Car[]
    totalElements: number
    totalPages: number
    page: number
    pageSize: number
}

export const carsApi = {
    // 🔹 Lấy danh sách phân trang + tìm kiếm (GET đang permitAll)
    fetchPage: async (page = 1, pageSize = 10, keyword = ""): Promise<CarPage> => {
        const res = await axios.get<CarPage>(API_URL, {
            params: { page, pageSize, keyword },
        })
        return res.data
    },

    // 🔹 Lấy tất cả
    getAll: async (): Promise<Car[]> => {
        const res = await axios.get<CarPage>(API_URL, { params: { page: 1, pageSize: 1000 } })
        return res.data.content
    },

    // 🔹 Lấy theo ID
    getById: async (id: number): Promise<Car> => {
        const res = await axios.get<Car>(`${API_URL}/${id}`)
        return res.data
    },

    // 🔹 Thêm mới (cần token)
    create: async (formData: FormData): Promise<Car> => {
        const res = await axios.post<Car>(API_URL, formData, {
            headers: {
                ...getAuthHeader(),          // 👈 thêm Authorization
                // KHÔNG cần set Content-Type, axios tự set cho FormData
            },
        })
        return res.data
    },

    // 🔹 Cập nhật (cần token)
    update: async (id: number, formData: FormData): Promise<Car> => {
        const res = await axios.put<Car>(`${API_URL}/${id}`, formData, {
            headers: {
                ...getAuthHeader(),
            },
        })
        return res.data
    },

    // 🔹 Xóa (cần token)
    delete: async (id: number): Promise<{ message: string }> => {
        const res = await axios.delete<{ message: string }>(`${API_URL}/${id}`, {
            headers: {
                ...getAuthHeader(),
            },
        })
        return res.data
    },
}
