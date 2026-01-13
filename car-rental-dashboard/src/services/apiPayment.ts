import api from "./user/api"

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED"

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

export interface PageResponse<T> {
    content: T[]
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
}

const API_URL = "/admin/payments" // ✅ dùng relative vì baseURL đã có /api

export const apiPayment = {
    getPage: async (
        page: number,
        size: number,
        keyword?: string,
        status?: PaymentStatus,
        customerId?: number
    ): Promise<PageResponse<PaymentDTO>> => {
        const res = await api.get<PageResponse<PaymentDTO>>(API_URL, {
            params: { page, size, keyword, status, customerId },
        })
        return res.data
    },

    getById: async (id: number): Promise<PaymentDTO> => {
        const res = await api.get<PaymentDTO>(`${API_URL}/${id}`)
        return res.data
    },

    save: async (payment: PaymentDTO): Promise<PaymentDTO> => {
        const res = await api.post<PaymentDTO>(API_URL, payment)
        return res.data
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`${API_URL}/${id}`)
    },

    updateStatus: async (id: number, status: PaymentStatus): Promise<PaymentDTO> => {
        const res = await api.put<PaymentDTO>(`${API_URL}/${id}/status`, null, {
            params: { status },
        })
        return res.data
    },
}
