import api from "./user/api";

export interface DashboardStats {
    totalCars: number;
    bookingsToday: number;
    bookingsThisMonth: number;
    revenueThisMonth: number;
    newCustomers: number;
    pendingBookings: number;
    cancelRate: number;
}

export interface RevenuePoint { month: string; revenue: number }
export interface BrandRatio { brand: string; count: number }
export interface BookingPoint { day: string; bookings: number }

export interface DashboardReport {
    monthlyRevenue: RevenuePoint[]
    brandRatio: BrandRatio[]
    dailyBookings: BookingPoint[]
}

export type ReportParams = {
    startDate?: string
    endDate?: string
    brand?: string
    carType?: string
}

export const dashboardApi = {
    getStats: async (): Promise<DashboardStats> => {
        const res = await api.get<DashboardStats>("/admin/dashboard/stats");
        return res.data;
    },

    getReport: async (params?: ReportParams): Promise<DashboardReport> => {
        const res = await api.get<DashboardReport>("/admin/dashboard/report", { params });
        return res.data;
    },

    exportReportPdf: async (params?: ReportParams): Promise<Blob> => {
        const res = await api.get<Blob>("/admin/dashboard/report/pdf", {
            params,
            responseType: "blob" as const,
        })
        return res.data
    },
};