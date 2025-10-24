import axios from "axios"

/**
 * DTO đại diện cho dữ liệu xe hiển thị cho user (gồm chi tiết kỹ thuật)
 */
export interface CarUserDTO {
    carId: number
    carName: string
    imageUrl: string
    gallery: string[]
    brandName: string
    typeName: string
    price: number | null
    seats: number
    fuelType: string
    engine: string | null
    transmission: string | null
    location: string
    rating: number
    status: "AVAILABLE" | "RENTED" | "MAINTENANCE"
    year: number
    color: string | null
    licensePlate: string | null
    description: string | null
    createdDate: string | null
    latitude: number | null
    longitude: number | null
    featured: boolean
    // Thêm mới
    features?: string[]
    policies?: string[]
}

// Base URL từ ENV (ưu tiên NEXT_PUBLIC_API_URL) hoặc mặc định localhost
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8080/api"

/**
 * Lấy danh sách tất cả xe
 */
export async function getAllCars(): Promise<CarUserDTO[]> {
    try {
        const { data } = await axios.get<CarUserDTO[]>(`${API_BASE_URL}/user/cars`)
        return data
    } catch (error) {
        console.error("Lỗi khi lấy danh sách xe:", error)
        throw error
    }
}

/**
 * Lấy chi tiết xe theo id
 */
export async function getCarById(carId: number): Promise<CarUserDTO> {
    try {
        const { data } = await axios.get<CarUserDTO>(`${API_BASE_URL}/user/cars/${carId}`)
        return data
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết xe id=${carId}:`, error)
        throw error
    }
}
