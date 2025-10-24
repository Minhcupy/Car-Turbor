"use client";

import { useEffect, useState } from "react";
import { dashboardApi, DashboardStats } from "@/src/services/dashboardApi";
import { Card } from "@/components/ui/card";
import { Car, Calendar, DollarSign, Users, Clock } from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const s = await dashboardApi.getStats();
        setStats(s);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  const safeStats: DashboardStats = stats || {
    totalCars: 0,
    bookingsToday: 0,
    bookingsThisMonth: 0,
    revenueThisMonth: 0,
    newCustomers: 0,
    pendingBookings: 0,
    cancelRate: 0,
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="p-6 bg-blue-50 border-blue-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40 cursor-pointer transition-all hover:bg-blue-100 hover:shadow-lg hover:scale-105">
          <Car className="h-8 w-8 text-blue-600 mb-2" />
          <p className="text-base text-blue-600 font-medium">Tổng số xe</p>
          <p className="text-3xl font-bold text-blue-900">{safeStats.totalCars}</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40 cursor-pointer transition-all hover:bg-green-100 hover:shadow-lg hover:scale-105">
          <Calendar className="h-8 w-8 text-green-600 mb-2" />
          <p className="text-base text-green-600 font-medium">Đơn hôm nay</p>
          <p className="text-3xl font-bold text-green-900">{safeStats.bookingsToday}</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40 cursor-pointer transition-all hover:bg-purple-100 hover:shadow-lg hover:scale-105">
          <Calendar className="h-8 w-8 text-purple-600 mb-2" />
          <p className="text-base text-purple-600 font-medium">Đơn tháng này</p>
          <p className="text-3xl font-bold text-purple-900">{safeStats.bookingsThisMonth}</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40 cursor-pointer transition-all hover:bg-yellow-100 hover:shadow-lg hover:scale-105">
          <DollarSign className="h-8 w-8 text-yellow-600 mb-2" />
          <p className="text-base text-yellow-600 font-medium">Doanh thu tháng</p>
          <p className="text-3xl font-bold text-yellow-900">
            {safeStats.revenueThisMonth.toLocaleString()} đ
          </p>
        </Card>

        <Card className="p-6 bg-pink-50 border-pink-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40 cursor-pointer transition-all hover:bg-pink-100 hover:shadow-lg hover:scale-105">
          <Users className="h-8 w-8 text-pink-600 mb-2" />
          <p className="text-base text-pink-600 font-medium">Khách mới</p>
          <p className="text-3xl font-bold text-pink-900">{safeStats.newCustomers}</p>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200 flex flex-col items-center justify-center rounded-2xl shadow-md h-40 cursor-pointer transition-all hover:bg-red-100 hover:shadow-lg hover:scale-105">
          <Clock className="h-8 w-8 text-red-600 mb-2" />
          <p className="text-base text-red-600 font-medium">Đơn chờ xử lý</p>
          <p className="text-3xl font-bold text-red-900">{safeStats.pendingBookings}</p>
        </Card>
      </div>

      {/* Biểu đồ placeholder */}
      <Card className="p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">📈 Doanh thu mẫu (tĩnh)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={[
              { month: "Jan", revenue: 4000 },
              { month: "Feb", revenue: 3000 },
              { month: "Mar", revenue: 2000 },
              { month: "Apr", revenue: 2780 },
              { month: "May", revenue: 1890 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
