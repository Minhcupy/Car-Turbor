
import api from "@/src/services/user/api"

// ==== Kiểu dữ liệu mapping với BE ====
export interface BookingHistory {
    bookingId: number;
    carName: string;
    startDate: string;
    endDate: string;
    status: string;      // Enum: PENDING | CONFIRMED | CANCELED | COMPLETED
    statusLabel: string;
    paymentMethod: string;
    totalAmount: number;
}

export interface BookingDetail {
    bookingId: number;
    carName: string;
    brandName: string;
    carType: string;
    startDate: string;
    endDate: string;
    status: string;
    statusLabel: string;
    paymentMethod: string;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
}

// ==== API ====

/**
 * 1. Lấy danh sách lịch sử đơn hàng của user hiện tại
 */
export async function getBookingHistory(): Promise<BookingHistory[]> {
    const res = await api.get<BookingHistory[]>("/users/historybooking");
    return res.data;
}

/**
 * 2. Xem chi tiết 1 đơn hàng
 */
export async function getBookingDetail(bookingId: number): Promise<BookingDetail> {
    const res = await api.get<BookingDetail>(`/users/historybooking/${bookingId}`);
    return res.data;
}

/**
 * 3. Hủy đơn hàng (chỉ khi đang PENDING)
 */
export async function cancelBooking(bookingId: number): Promise<{ message: string }> {
    const res = await api.put<{ message: string }>(`/users/historybooking/${bookingId}/cancel`);
    return res.data;
}
