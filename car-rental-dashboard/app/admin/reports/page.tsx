"use client"

import { useEffect, useMemo, useState } from "react"
import { ChartCard } from "@/components/ui-admin/chart-card"
import { Button } from "@/components/ui-admin/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-admin/select"
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
import { dashboardApi, DashboardReport } from "@/src/services/dashboardApi"
import { DateRangeInputs, type SimpleDateRange } from "@/components/ui-admin/date-range-inputs"

const COLORS = ["#3B82F6", "#6366F1", "#F59E0B", "#10B981", "#8B5CF6"]

function todayYMD() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export default function ReportsPage() {
  const [chartData, setChartData] = useState<DashboardReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // ✅ filter state (YYYY-MM-DD)
  const [dateRange, setDateRange] = useState<SimpleDateRange>({
    from: "2024-01-01",
    to: todayYMD(),
  })
  const [brand, setBrand] = useState<string>("all")
  const [carType, setCarType] = useState<string>("all")

  const safe = useMemo(() => {
    const monthlyRevenue = chartData?.monthlyRevenue ?? []
    const brandRatio = chartData?.brandRatio ?? []
    const dailyBookings = chartData?.dailyBookings ?? []
    const dailyBookingsLast30 = dailyBookings.length > 30 ? dailyBookings.slice(-30) : dailyBookings
    const totalBookings = dailyBookings.reduce((sum, x) => sum + (x.bookings ?? 0), 0)
    const maxBookings = dailyBookings.reduce((m, x) => Math.max(m, x.bookings ?? 0), 0)
    const hasAnyBooking = dailyBookings.some((x) => (x.bookings ?? 0) > 0)
    return { monthlyRevenue, brandRatio, dailyBookingsLast30, totalBookings, maxBookings, hasAnyBooking }
  }, [chartData])

  const fetchReport = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const params = {
        startDate: dateRange.from,
        endDate: dateRange.to,
        brand: brand === "all" ? undefined : brand,
        carType: carType === "all" ? undefined : carType,
      }
      const data = await dashboardApi.getReport(params)
      setChartData(data)
    } catch (err) {
      console.error(err)
      setChartData(null)
      setErrorMsg("Failed to load report data. Please login again or try later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasRevenueTrend = (chartData?.monthlyRevenue?.length ?? 0) >= 2

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
                <DateRangeInputs value={dateRange} onChange={setDateRange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="All brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {safe.brandRatio.map((b) => (
                        <SelectItem key={b.brand} value={b.brand}>
                          {b.brand}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Car Type</label>
                <Select value={carType} onValueChange={setCarType}>
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
                <Button className="flex-1" onClick={fetchReport} disabled={loading}>
                  {loading ? "Loading..." : "Generate Report"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {errorMsg ? <div className="flex items-center justify-center h-32 text-red-500">{errorMsg}</div> : null}

        {/* Summary */}
        {chartData ? (
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Quick stats from the current response</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total bookings in range</div>
                  <div className="text-xl font-semibold">{safe.totalBookings}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Max bookings in a day</div>
                  <div className="text-xl font-semibold">{safe.maxBookings}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Revenue points</div>
                  <div className="text-xl font-semibold">{safe.monthlyRevenue.length}</div>
                </div>
              </CardContent>
            </Card>
        ) : null}

        {/* Charts */}
        {chartData ? (
            <div className="grid gap-4 md:grid-cols-2">
              <ChartCard title="Revenue Trends" description="Monthly revenue over time">
                {safe.monthlyRevenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={safe.monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}`, "Revenue"]} />
                        <Line type="monotone" dataKey="revenue" strokeWidth={2} dot />
                      </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No revenue data in selected range
                    </div>
                )}
              </ChartCard>

              <ChartCard title="Fleet Distribution" description="Cars by brand">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                        data={safe.brandRatio}
                        cx="50%"
                        cy="50%"
                        outerRadius={105}
                        dataKey="count"
                        nameKey="brand"
                        label={(p) => `${p.name}: ${p.value}`}
                    >
                      {safe.brandRatio.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Booking Patterns" description="Daily booking trends (last 30 days)" className="md:col-span-2">
                {safe.hasAnyBooking ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={safe.dailyBookingsLast30}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" interval="preserveStartEnd" />
                        <YAxis allowDecimals={false} domain={[0, "dataMax + 1"]} />
                        <Tooltip />
                        <Bar dataKey="bookings" minPointSize={2} />
                      </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No bookings in selected range
                    </div>
                )}
              </ChartCard>
            </div>
        ) : null}

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
