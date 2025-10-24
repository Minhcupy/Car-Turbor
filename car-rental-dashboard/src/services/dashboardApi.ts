import api from "./user/api"; // axios instance (có interceptor JWT)

// ====== TYPES ======
export interface DashboardStats {
    totalCars: number;
    bookingsToday: number;
    bookingsThisMonth: number;
    revenueThisMonth: number;
    newCustomers: number;
    pendingBookings: number;
    cancelRate: number;
}

export interface RevenueChart {
    month: string;
    revenue: number;
}

export interface DailyBookings {
    day: string;
    bookings: number;
}

export interface Ratio {
    label: string;
    count: number;
}

export interface RecentBooking {
    customerName: string;
    carName: string;
    status: string;
    totalPrice: number;
    createdAt: string;
}

export interface RecentCustomer {
    name: string;
    email: string;
    createdAt: string;
    totalBookings: number;
}

// ====== API METHODS ======
export const dashboardApi = {
    getStats: async (): Promise<DashboardStats> => {
        const res = await api.get<DashboardStats>("/admin/dashboard/stats");
        return res.data;
    },

    // getRevenue: async (): Promise<RevenueChart[]> => {
    //     const res = await api.get<RevenueChart[]>("/admin/dashboard/charts/revenue");
    //     return res.data;
    // },

    // getDailyBookings: async (): Promise<DailyBookings[]> => {
    //     const res = await api.get<DailyBookings[]>("/admin/dashboard/charts/daily-bookings");
    //     return res.data;
    // },

    // getFleetByBrand: async (): Promise<Ratio[]> => {
    //     const res = await api.get<Ratio[]>("/admin/dashboard/charts/brands");
    //     return res.data;
    // },

    // getFleetByType: async (): Promise<Ratio[]> => {
    //     const res = await api.get<Ratio[]>("/admin/dashboard/charts/types");
    //     return res.data;
    // },

    // getRecentBookings: async (): Promise<RecentBooking[]> => {
    //     const res = await api.get<RecentBooking[]>("/admin/dashboard/recent/bookings");
    //     return res.data;
    // },

    // getRecentCustomers: async (): Promise<RecentCustomer[]> => {
    //     const res = await api.get<RecentCustomer[]>("/admin/dashboard/recent/customers");
    //     return res.data;
    // },
};
