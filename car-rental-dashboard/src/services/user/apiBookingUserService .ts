import api from "@/src/services/user/api"

// ====================== Interfaces ======================
export interface CarItem {
    carId: number            // mã xe (PK)
    carName: string          // tên xe
    brandName: string        // hãng xe
    typeName: string         // loại xe
    // giá thuê 1 ngày
    status: "AVAILABLE" | "UNAVAILABLE" | "MAINTENANCE" // trạng thái
    // thông tin bổ sung (optional)
    imageUrl?: string        // ảnh chính
    seats?: number           // số chỗ ngồi
    transmission?: "MANUAL" | "AUTO" // hộp số
    fuel?: string            // loại nhiên liệu
    features?: string[]      // các tính năng nổi bật
    rating?: number          // đánh giá trung bình
    price: number
    fuelType: string
    engine: string | null

    location: string
    image?: string
    gallery?: string[]
    year: number
    color: string | null




}

export interface BookingRequestDTO {
    carId: number
    pickupLocation: string
    returnLocation: string
    pickupDate: string
    returnDate: string
    pickupTime: string
    returnTime: string
    notes?: string
    fullName: string
    email: string
    phone: string
    address: string
    idNumber: string
    licenseNumber: string



}

export interface BookingResponseDTO {
    bookingId: number
    status: string
    carId: number
    carName: string
    carImage: string
    pickupLocation: string
    returnLocation: string
    pickupDate: string
    returnDate: string
    pickupTime: string
    returnTime: string
    totalAmount: number
    depositAmount: number
    customerName: string
    customerPhone: string
    customerEmail: string
    licenseNumber: string

}

export interface BookingPreviewDTO {
    rentalDays: number
    price: number
    totalAmount: number
    depositAmount: number
}


// ====================== Car Service ======================
export const carApi = {
    async getAllCars(): Promise<CarItem[]> {
        const res = await api.get<CarItem[]>("/user/cars")
        return res.data
    },

    async getCarById(id: number): Promise<CarItem> {
        const res = await api.get<CarItem>(`/user/cars/${id}`)
        return res.data
    },
}

// ====================== Booking Service ======================
export const bookingApi = {
    /**
     * Step 2 - Preview booking cost
     */
    async previewBooking(dto: BookingRequestDTO): Promise<BookingPreviewDTO> {
        const res = await api.post<BookingPreviewDTO>("/user/bookings/preview", dto)
        return res.data
    },

    /**
     * Step 3 - Create booking
     */
    async createBooking(dto: BookingRequestDTO): Promise<BookingResponseDTO> {
        const res = await api.post<BookingResponseDTO>("/user/bookings", dto)
        return res.data
    },

    /**
     * Step 4 - Get bookings by customer
     */
    async getBookingsByCustomer(customerId: number): Promise<BookingResponseDTO[]> {
        const res = await api.get<BookingResponseDTO[]>(`/user/bookings/customer/${customerId}`)
        return res.data
    },

    /**
     * Optional: Get booking detail by id
     */
    async getBookingById(bookingId: number): Promise<BookingResponseDTO> {
        const res = await api.get<BookingResponseDTO>(`/user/bookings/${bookingId}`)
        return res.data
    },

}
