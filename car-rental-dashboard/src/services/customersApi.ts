import api from "./user/api"

export interface CustomerSummary {
    customerId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    status: string;
    lastBookingDate: string;
    lastCarName: string;
    totalBookings: number;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number; // trang hiện tại
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export async function getCustomers(
    keyword = "",
    page = 0,
    size = 10
): Promise<PageResponse<CustomerSummary>> {
    const res = await api.get<PageResponse<CustomerSummary>>("/customers", {
        params: { keyword, page, size },
    });
    return res.data;
}

export async function deleteCustomer(id: number) {
    await api.delete(`/customers/${id}`);
}
