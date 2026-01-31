// dashboardApi.ts
import api from "./user/api"

export interface RevenuePoint { month: string; revenue: number }
export interface BrandRatio { brand: string; count: number }
export interface BookingPoint { day: string; bookings: number }

export interface DashboardReport {
    monthlyRevenue: RevenuePoint[]
    brandRatio: BrandRatio[]
    dailyBookings: BookingPoint[]
}

type ReportParams = {
    startDate?: string
    endDate?: string
    brand?: string
    carType?: string
}

export const dashboardApi = {
    getReport: async (params?: ReportParams): Promise<DashboardReport> => {
        const res = await api.get<DashboardReport>("/admin/dashboard/report", { params })
        return res.data
    },
}
