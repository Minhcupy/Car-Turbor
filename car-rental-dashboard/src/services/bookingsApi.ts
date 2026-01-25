import api from "./user/api"

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED"
export type ContractStatus = "DRAFT" | "SIGNED_ELECTRONIC" | "SIGNED_DIGITAL" | "VOID"

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

    customerName: string
    customerPhone: string
    carName: string
    brandName: string

    contractId?: number | null
    contractStatus?: ContractStatus | null
}

export interface Page<T> {
    content: T[]
    totalPages: number
    totalElements: number
    pageSize: number
    pageNumber: number
    first: boolean
    last: boolean
}

const API_URL = "/admin/bookings"
const CONTRACT_ADMIN_URL = "/admin/contracts"

export const bookingsApi = {
    getPage: async (page: number, size: number, keyword?: string): Promise<Page<Booking>> => {
        const res = await api.get(API_URL, { params: { page, size, keyword } })
        return res.data as Page<Booking>
    },

    getById: async (id: number): Promise<Booking> => {
        const res = await api.get<Booking>(`${API_URL}/${id}`)
        return res.data
    },

    updateStatus: async (id: number, status: BookingStatus): Promise<Booking> => {
        const res = await api.put<Booking>(`${API_URL}/${id}/status`, null, { params: { status } })
        return res.data
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`${API_URL}/${id}`)
    },

    getQRCodeUrl: (id: number): string => {
        // endpoint QR của bạn đang là /api/admin/bookings/{id}/qrcode
        // axios baseURL đã là http://localhost:8080/api nên để tương đối
        return `${api.defaults.baseURL}${API_URL}/${id}/qrcode`
    },

    // ✅ admin ký số hoàn tất
    adminSignDigital: async (contractId: number) => {
        const res = await api.post(`${CONTRACT_ADMIN_URL}/${contractId}/sign-digital`)
        return res.data as { contractId: number; status: ContractStatus }
    },

    // ✅ LẤY PDF (có Authorization header) → trả Blob
    getContractPdfBlob: async (
        contractId: number,
        type: "unsigned" | "electronic" | "digital" = "digital"
    ): Promise<Blob> => {
        const res = await api.get(`${CONTRACT_ADMIN_URL}/${contractId}/pdf`, {
            params: { type },
            responseType: "blob",
        })
        return res.data as Blob
    },
}
