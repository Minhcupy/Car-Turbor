import api from "@/src/services/user/api"

// ====================== Interfaces ======================
export interface PaymentResponseDTO {
    paymentId: number
    bookingId: number
    amount: number
    status: string
    method: string
    payerName: string
    payerEmail: string
    payerPhone: string
    qrBase64?: string   // chỉ có khi simulate hoặc get QR
}

// ====================== Payment Service ======================
export const paymentApi = {
    /**
     * Tạo Payment cho 1 booking
     */
    async createPayment(
        bookingId: number,
        payer: { payerName: string; payerEmail: string; payerPhone: string },
        method: string = "SIMULATED"
    ): Promise<PaymentResponseDTO> {
        const res = await api.post<PaymentResponseDTO>(`/user/payments`, {
            bookingId,
            amount: null, // để BE tự tính deposit
            paymentMethod: method,
            ...payer,
        })
        return res.data
    },

    /**
     * Giả lập thanh toán → BE set status = PAID và trả về kèm QR
     */
    async simulatePay(paymentId: number): Promise<PaymentResponseDTO> {
        const res = await api.post<PaymentResponseDTO>(
            `/user/payments/${paymentId}/simulate-pay`
        )
        return res.data
    },

    /**
     * Lấy QR code PNG trực tiếp (dùng cho <img src="...">)
     */
    async getPaymentQr(paymentId: number): Promise<Blob> {
        const res = await api.get<Blob>(`/user/payments/${paymentId}/qrcode`, {
            responseType: "blob" as const,
        })
        return res.data
    },
}
