"use client"

import { useEffect, useState } from "react"
import { ChartCard } from "@/components/ui-admin/chart-card"
import { Button } from "@/components/ui-admin/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-admin/select"
import { DatePickerWithRange } from "@/components/ui-admin/date-range-picker"
import { Download, FileText } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import axios from "axios"

// ==== Kiểu dữ liệu từ BE ====
interface RevenuePoint {
  month: string
  revenue: number
}
interface BrandRatio {
  brand: string
  count: number
}
interface BookingPoint {
  day: string
  bookings: number
}
interface DashboardReport {
  monthlyRevenue: RevenuePoint[]
  brandRatio: BrandRatio[]
  dailyBookings: BookingPoint[]
}

const COLORS = ["#3B82F6", "#6366F1", "#F59E0B", "#10B981", "#8B5CF6"]

export default function ReportsPage() {
  const [chartData, setChartData] = useState<DashboardReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<DashboardReport>("http://localhost:8080/api/admin/dashboard/report")
        setChartData(res.data)
      } catch (error) {
        console.error("❌ Failed to fetch report data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!chartData) {
    return <div className="flex items-center justify-center h-64 text-red-500">No data available</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Reports</h1>
        <p className="text-muted-foreground">Analyze business performance with detailed reports and insights.</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Customize your report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {chartData.brandRatio.map((b) => (
                    <SelectItem key={b.brand} value={b.brand}>
                      {b.brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Car Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end space-x-2">
              <Button className="flex-1">Generate Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Doanh thu */}
        <ChartCard title="Revenue Trends" description="Monthly revenue over time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fleet theo brand */}
        <ChartCard title="Fleet Distribution" description="Cars by brand">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData.brandRatio} cx="50%" cy="50%" outerRadius={100} dataKey="count" label>
                {chartData.brandRatio.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Booking theo ngày */}
        <ChartCard title="Booking Patterns" description="Daily booking trends" className="md:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.dailyBookings.slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Download reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
