"use client";

import { useEffect, useMemo, useState } from "react";
import { dashboardApi, DashboardStats, DashboardReport } from "@/src/services/dashboardApi";
import { Card } from "@/components/ui/card";
import { Car, Calendar, DollarSign, Users, Clock, Loader2 } from "lucide-react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, r] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getReport(),
        ]);
        setStats(s);
        setReport(r);
      } catch (e) {
        console.error("Load dashboard failed:", e);
        setStats(null);
        setReport({ monthlyRevenue: [], brandRatio: [], dailyBookings: [] });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const safeStats: DashboardStats = stats ?? {
    totalCars: 0,
    bookingsToday: 0,
    bookingsThisMonth: 0,
    revenueThisMonth: 0,
    newCustomers: 0,
    pendingBookings: 0,
    cancelRate: 0,
  };

  const revenueChartData = useMemo(() => {
    const r = report ?? { monthlyRevenue: [], brandRatio: [], dailyBookings: [] };
    return r.monthlyRevenue.map(p => ({ month: p.month, revenue: p.revenue ?? 0 }));
  }, [report]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Đang tải dữ liệu...</span>
        </div>
    );
  }

  return (
      <div className="p-6 space-y-8">
        <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <Card className="p-6 bg-blue-50 border-blue-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40">
            <Car className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-base text-blue-600 font-medium">Tổng số xe</p>
            <p className="text-3xl font-bold text-blue-900">{safeStats.totalCars}</p>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40">
            <Calendar className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-base text-green-600 font-medium">Đơn hôm nay</p>
            <p className="text-3xl font-bold text-green-900">{safeStats.bookingsToday}</p>
          </Card>

          <Card className="p-6 bg-purple-50 border-purple-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40">
            <Calendar className="h-8 w-8 text-purple-600 mb-2" />
            <p className="text-base text-purple-600 font-medium">Đơn tháng này</p>
            <p className="text-3xl font-bold text-purple-900">{safeStats.bookingsThisMonth}</p>
          </Card>

          <Card className="p-6 bg-yellow-50 border-yellow-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40">
            <DollarSign className="h-8 w-8 text-yellow-600 mb-2" />
            <p className="text-base text-yellow-600 font-medium">Doanh thu tháng</p>
            <p className="text-3xl font-bold text-yellow-900">
              {Number(safeStats.revenueThisMonth).toLocaleString()} đ
            </p>
          </Card>

          <Card className="p-6 bg-pink-50 border-pink-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40">
            <Users className="h-8 w-8 text-pink-600 mb-2" />
            <p className="text-base text-pink-600 font-medium">Khách mới</p>
            <p className="text-3xl font-bold text-pink-900">{safeStats.newCustomers}</p>
          </Card>

          <Card className="p-6 bg-red-50 border-red-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40">
            <Clock className="h-8 w-8 text-red-600 mb-2" />
            <p className="text-base text-red-600 font-medium">Đơn chờ xử lý</p>
            <p className="text-3xl font-bold text-red-900">{safeStats.pendingBookings}</p>
          </Card>
        </div>

        <Card className="p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">📈 Doanh thu theo tháng</h2>
          {revenueChartData.length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có dữ liệu.</div>
          ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
          )}
        </Card>
      </div>
  );
}