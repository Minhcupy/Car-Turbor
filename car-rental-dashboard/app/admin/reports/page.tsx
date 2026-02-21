"use client"

import { useEffect, useMemo, useState } from "react"
import { ChartCard } from "@/components/ui-admin/chart-card"
import { Button } from "@/components/ui-admin/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-admin/select"
import { FileText } from "lucide-react"
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

import { dashboardApi, type DashboardReport, type ReportParams } from "@/src/services/dashboardApi"
import { DateRangeInputs, type SimpleDateRange } from "@/components/ui-admin/date-range-inputs"

// ✅ lấy danh sách loại xe từ API
import { carTypeApi, type CarTypeDTO } from "@/src/services/carTypeApi"

const COLORS = ["#3B82F6", "#6366F1", "#F59E0B", "#10B981", "#8B5CF6"]

function todayYMD() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export default function ReportsPage() {
  const [duLieuBaoCao, setDuLieuBaoCao] = useState<DashboardReport | null>(null)
  const [dangTai, setDangTai] = useState(true)
  const [thongBaoLoi, setThongBaoLoi] = useState<string | null>(null)

  // ✅ Loại xe từ API
  const [dsLoaiXe, setDsLoaiXe] = useState<CarTypeDTO[]>([])
  const [dangTaiLoaiXe, setDangTaiLoaiXe] = useState(false)

  // ✅ bộ lọc (YYYY-MM-DD)
  const [khoangNgay, setKhoangNgay] = useState<SimpleDateRange>({
    from: "2024-01-01",
    to: todayYMD(),
  })
  const [hangXe, setHangXe] = useState<string>("all")
  const [loaiXe, setLoaiXe] = useState<string>("all") // gửi typeName lên BE

  const safe = useMemo(() => {
    const monthlyRevenue = duLieuBaoCao?.monthlyRevenue ?? []
    const brandRatio = duLieuBaoCao?.brandRatio ?? []
    const dailyBookings = duLieuBaoCao?.dailyBookings ?? []

    const dailyBookingsLast30 = dailyBookings.length > 30 ? dailyBookings.slice(-30) : dailyBookings
    const totalBookings = dailyBookings.reduce((sum, x) => sum + (x.bookings ?? 0), 0)
    const maxBookings = dailyBookings.reduce((m, x) => Math.max(m, x.bookings ?? 0), 0)
    const hasAnyBooking = dailyBookings.some((x) => (x.bookings ?? 0) > 0)

    return {
      monthlyRevenue,
      brandRatio,
      dailyBookingsLast30,
      totalBookings,
      maxBookings,
      hasAnyBooking,
    }
  }, [duLieuBaoCao])

  const taiBaoCao = async () => {
    setDangTai(true)
    setThongBaoLoi(null)
    try {
      const params: ReportParams = {
        startDate: khoangNgay.from,
        endDate: khoangNgay.to,
        brand: hangXe === "all" ? undefined : hangXe,
        carType: loaiXe === "all" ? undefined : loaiXe,
      }

      const data = await dashboardApi.getReport(params)
      setDuLieuBaoCao(data)
    } catch (err) {
      console.error(err)
      setDuLieuBaoCao(null)
      setThongBaoLoi("Không tải được dữ liệu báo cáo. Vui lòng đăng nhập lại hoặc thử sau.")
    } finally {
      setDangTai(false)
    }
  }

  const xuatPdf = async () => {
    try {
      const params: ReportParams = {
        startDate: khoangNgay.from,
        endDate: khoangNgay.to,
        brand: hangXe === "all" ? undefined : hangXe,
        carType: loaiXe === "all" ? undefined : loaiXe,
      }

      const blob = await dashboardApi.exportReportPdf(params)

      // ✅ tải file
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `bao-cao-dashboard_${params.startDate}_${params.endDate}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      setThongBaoLoi("Xuất PDF thất bại.")
    }
  }

  // ✅ load loại xe 1 lần + tải báo cáo mặc định
  useEffect(() => {
    const loadCarTypes = async () => {
      setDangTaiLoaiXe(true)
      try {
        const types = await carTypeApi.getAll()
        setDsLoaiXe(types)
      } catch (e) {
        console.error("Load car types failed:", e)
        setDsLoaiXe([])
      } finally {
        setDangTaiLoaiXe(false)
      }
    }

    loadCarTypes()
    taiBaoCao()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
      <div className="w-full">
        <div className="space-y-6">
          {/* Tiêu đề */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Báo cáo</h1>
            <p className="text-sm text-muted-foreground">
              Phân tích hiệu quả kinh doanh với báo cáo và biểu đồ chi tiết.
            </p>
          </div>

          {/* Bộ lọc */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Bộ lọc báo cáo</CardTitle>
              <CardDescription>Tùy chỉnh tham số để tạo báo cáo</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-12 gap-4 items-end">
                {/* Khoảng ngày */}
                <div className="col-span-12 lg:col-span-4 space-y-2">
                  <label className="text-sm font-medium">Khoảng ngày</label>
                  <div className="w-full [&_input]:h-10 [&_button]:h-10">
                    <DateRangeInputs value={khoangNgay} onChange={setKhoangNgay} />
                  </div>
                </div>

                {/* Hãng xe */}
                <div className="col-span-12 lg:col-span-3 space-y-2">
                  <label className="text-sm font-medium">Hãng xe</label>
                  <Select value={hangXe} onValueChange={setHangXe}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Tất cả hãng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả hãng</SelectItem>
                      {safe.brandRatio.map((b) => (
                          <SelectItem key={b.brand} value={b.brand}>
                            {b.brand}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Loại xe */}
                <div className="col-span-12 lg:col-span-3 space-y-2">
                  <label className="text-sm font-medium">Loại xe</label>
                  <Select value={loaiXe} onValueChange={setLoaiXe}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={dangTaiLoaiXe ? "Đang tải..." : "Tất cả loại"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại</SelectItem>
                      {dsLoaiXe.map((t) => (
                          <SelectItem key={t.carTypeId} value={t.typeName}>
                            {t.typeName}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Nút tạo báo cáo */}
                <div className="col-span-12 lg:col-span-2">
                  <Button className="w-full h-10" onClick={taiBaoCao} disabled={dangTai}>
                    {dangTai ? "Đang tải..." : "Tạo báo cáo"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {thongBaoLoi ? (
              <div className="flex items-center justify-center h-32 text-red-500">{thongBaoLoi}</div>
          ) : null}

          {/* Tóm tắt */}
          {duLieuBaoCao ? (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Tóm tắt</CardTitle>
                  <CardDescription>Chỉ số nhanh theo dữ liệu hiện tại</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="rounded-xl border p-4">
                    <div className="text-muted-foreground">Tổng booking trong khoảng</div>
                    <div className="text-2xl font-semibold mt-1">{safe.totalBookings}</div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-muted-foreground">Booking lớn nhất/ngày</div>
                    <div className="text-2xl font-semibold mt-1">{safe.maxBookings}</div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-muted-foreground">Số điểm doanh thu</div>
                    <div className="text-2xl font-semibold mt-1">{safe.monthlyRevenue.length}</div>
                  </div>
                </CardContent>
              </Card>
          ) : null}

          {/* Biểu đồ */}
          {duLieuBaoCao ? (
              <div className="grid gap-4 md:grid-cols-2">
                <ChartCard title="Xu hướng doanh thu" description="Doanh thu theo tháng">
                  {safe.monthlyRevenue.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={safe.monthlyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}`, "Doanh thu"]} />
                          <Line type="monotone" dataKey="revenue" strokeWidth={2} dot />
                        </LineChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Không có dữ liệu doanh thu trong khoảng đã chọn
                      </div>
                  )}
                </ChartCard>

                <ChartCard title="Phân bổ đội xe" description="Số xe theo hãng">
                  {safe.brandRatio.length > 0 ? (
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
                  ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Không có dữ liệu hãng xe
                      </div>
                  )}
                </ChartCard>

                <ChartCard
                    title="Xu hướng booking"
                    description="Số booking theo ngày (30 ngày gần nhất trong khoảng)"
                    className="md:col-span-2"
                >
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
                        Không có booking trong khoảng đã chọn
                      </div>
                  )}
                </ChartCard>
              </div>
          ) : null}

          {/* Xuất báo cáo */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Xuất báo cáo</CardTitle>
              <CardDescription>Tải báo cáo dưới dạng PDF</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="h-10" onClick={xuatPdf} disabled={dangTai}>
                  <FileText className="w-4 h-4 mr-2" />
                  Xuất PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}