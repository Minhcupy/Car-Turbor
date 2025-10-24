// src/services/carsApi.ts
import axios from "axios"

const API_URL = "http://localhost:8080/api/cars"

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
    // 🔹 Lấy danh sách phân trang + tìm kiếm
    fetchPage: async (page = 1, pageSize = 10, keyword = ""): Promise<CarPage> => {
        const res = await axios.get<CarPage>(API_URL, {
            params: { page, pageSize, keyword },
        })
        return res.data
    },

    // 🔹 Lấy tất cả (nếu BE hỗ trợ)
    getAll: async (): Promise<Car[]> => {
        const res = await axios.get<CarPage>(API_URL, { params: { page: 1, pageSize: 1000 } })
        return res.data.content
    },

    // 🔹 Lấy theo ID
    getById: async (id: number): Promise<Car> => {
        const res = await axios.get<Car>(`${API_URL}/${id}`)
        return res.data
    },

    // Thêm mới
    create: async (formData: FormData): Promise<Car> => {
        const res = await axios.post<Car>(API_URL, formData) // ⚠️ không ép headers, axios tự set
        return res.data
    },

    // Cập nhật
    update: async (id: number, formData: FormData): Promise<Car> => {
        const res = await axios.put<Car>(`${API_URL}/${id}`, formData)
        return res.data
    },

    // 🔹 Xóa
    delete: async (id: number): Promise<{ message: string }> => {
        const res = await axios.delete<{ message: string }>(`${API_URL}/${id}`)
        return res.data
    },
}
