import axios from "axios"

// Các trạng thái thanh toán (theo enum bên BE)
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED"

// DTO trả về từ BE
export interface PaymentDTO {
    paymentId: number
    bookingId: number
    customerName: string
    carName: string
    amount: number
    method: string
    status: PaymentStatus
    paymentDate: string
}

// Page response chuẩn (theo PageResponse<PaymentDTO> ở BE)
export interface PageResponse<T> {
    content: T[]
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
}

const API_URL = "http://localhost:8080/api/admin/payments"

export const apiPayment = {
    // ✅ Lấy danh sách có phân trang + tìm kiếm + filter
    getPage: async (
        page: number,
        size: number,
        keyword?: string,
        status?: PaymentStatus,
        customerId?: number
    ): Promise<PageResponse<PaymentDTO>> => {
        const res = await axios.get<PageResponse<PaymentDTO>>(API_URL, {
            params: { page, size, keyword, status, customerId },
        })
        return res.data
    },

    // ✅ Lấy chi tiết theo ID
    getById: async (id: number): Promise<PaymentDTO> => {
        const res = await axios.get<PaymentDTO>(`${API_URL}/${id}`)
        return res.data
    },

    // ✅ Cập nhật hoặc tạo Payment (Admin chỉnh sửa)
    save: async (payment: PaymentDTO): Promise<PaymentDTO> => {
        const res = await axios.post<PaymentDTO>(API_URL, payment)
        return res.data
    },

    // ✅ Xóa Payment
    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`)
    },

    // ✅ Cập nhật trạng thái Payment
    updateStatus: async (id: number, status: PaymentStatus): Promise<PaymentDTO> => {
        const res = await axios.put<PaymentDTO>(`${API_URL}/${id}/status`, null, {
            params: { status },
        })
        return res.data
    },
}
