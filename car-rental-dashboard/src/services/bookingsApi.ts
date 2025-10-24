import axios from "axios"

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED"

export interface Booking {
    bookingId: number
    pickupLocation: string
    returnLocation: string
    pickupDate: string
    returnDate: string
    pickupTime: string
    returnTime: string
    totalAmount: number
    depositAmount: number
    notes?: string
    status: BookingStatus

    // Flatten từ DTO
    customerName: string
    customerPhone: string
    carName: string
    brandName: string
}

export interface Page<T> {
    content: T[]
    totalPages: number
    totalElements: number
    size: number
    number: number
    first: boolean
    last: boolean
}
const API_URL = "http://localhost:8080/api/admin/bookings"

export const bookingsApi = {
    // ✅ Lấy danh sách + tìm kiếm + phân trang
    getPage: async (
        page: number,
        size: number,
        keyword?: string
    ): Promise<Page<Booking>> => {
        const res = await axios.get<Page<Booking>>(API_URL, {
            params: { page, size, keyword },
        })
        return res.data
    },

    // Lấy chi tiết booking theo ID
    getById: async (id: number): Promise<Booking> => {
        const res = await axios.get<Booking>(`${API_URL}/${id}`)
        return res.data
    },

    // Cập nhật trạng thái booking
    updateStatus: async (id: number, status: BookingStatus): Promise<Booking> => {
        const res = await axios.put<Booking>(`${API_URL}/${id}/status`, null, {
            params: { status },
        })
        return res.data
    },

    // Xóa booking
    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`)
    },

    // Lấy QR code (ảnh PNG)
    getQRCodeUrl: (id: number): string => {
        return `${API_URL}/${id}/qrcode`
    },
}
