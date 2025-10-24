"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "../Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    getBookingHistory,
    getBookingDetail,
    cancelBooking,
    BookingHistory,
    BookingDetail,
} from "@/src/services/user/userHistoryBooking"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Eye, XCircle, Clock, CheckCircle, Ban, Search } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function BookingsPage() {
    const [bookings, setBookings] = useState<BookingHistory[]>([])
    const [loading, setLoading] = useState(true)

    const [openDetail, setOpenDetail] = useState(false)
    const [detail, setDetail] = useState<BookingDetail | null>(null)

    // filter & search state
    const [searchId, setSearchId] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    useEffect(() => {
        async function fetchBookings() {
            try {
                const data = await getBookingHistory()
                setBookings(data)
            } catch (err) {
                console.error("Failed to load bookings", err)
            } finally {
                setLoading(false)
            }
        }
        fetchBookings()
    }, [])

    const handleCancel = async (id: number) => {
        if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return
        try {
            await cancelBooking(id)
            alert("Đơn hàng đã được hủy thành công")
            setBookings((prev) =>
                prev.map((b) =>
                    b.bookingId === id ? { ...b, status: "CANCELED", statusLabel: "Đã hủy" } : b
                )
            )
        } catch (err) {
            console.error("Cancel failed", err)
            alert("Không thể hủy đơn hàng này")
        }
    }

    const handleViewDetail = async (id: number) => {
        try {
            const data = await getBookingDetail(id)
            setDetail(data)
            setOpenDetail(true)
        } catch (err) {
            console.error("Failed to load booking detail", err)
            alert("Không thể tải chi tiết đơn hàng")
        }
    }

    // lọc dữ liệu
    const filteredBookings = bookings.filter((b) => {
        const matchId = searchId ? b.bookingId.toString().includes(searchId) : true
        const matchStatus = statusFilter === "ALL" ? true : b.status === statusFilter
        return matchId && matchStatus
    })

    return (
        <div className="bg-gray-100 px-6 pt-8 pb-6">
            <div className="mx-auto flex w-full max-w-[1200px] gap-8 items-start">
                {/* Sidebar */}
                <aside className="w-64">
                    <Sidebar />
                </aside>

                {/* Nội dung chính */}
                <section className="flex-1">
                    <Card className="rounded-xl shadow-sm mb-6">
                        <CardContent className="p-8 space-y-6">
                            <h1 className="text-2xl font-bold text-slate-900">Lịch sử đơn hàng</h1>

                            {/* Bộ lọc tìm kiếm */}
                            <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 border rounded-md bg-white px-2">
                                    <Search className="h-4 w-4 text-slate-500" />
                                    <Input
                                        placeholder="Tìm theo mã đơn"
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        className="border-0 focus:ring-0"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="rounded-md border border-gray-300 p-2 bg-white"
                                >
                                    <option value="ALL">Tất cả trạng thái</option>
                                    <option value="PENDING">Chờ xác nhận</option>
                                    <option value="CONFIRMED">Đã xác nhận</option>
                                    <option value="CANCELED">Đã hủy</option>
                                    <option value="COMPLETED">Hoàn thành</option>
                                </select>
                            </div>

                            {/* Bảng lịch sử */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-cyan-100 text-slate-800 font-semibold">
                                            <th className="px-4 py-3 text-left">Mã đơn</th>
                                            <th className="px-4 py-3 text-left">Xe</th>
                                            <th className="px-4 py-3 text-left">Ngày nhận</th>
                                            <th className="px-4 py-3 text-left">Ngày trả</th>
                                            <th className="px-4 py-3 text-left">Trạng thái</th>
                                            <th className="px-4 py-3 text-left">Thành tiền</th>
                                            <th className="px-4 py-3 text-center">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={7} className="text-center py-6 text-slate-500">
                                                    Đang tải dữ liệu...
                                                </td>
                                            </tr>
                                        ) : filteredBookings.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center py-6 text-slate-500">
                                                    Không có đơn hàng nào.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredBookings.map((b) => (
                                                <tr key={b.bookingId} className="border-t hover:bg-gray-50 transition">
                                                    <td className="px-4 py-3">{b.bookingId}</td>
                                                    <td className="px-4 py-3 font-medium">{b.carName}</td>
                                                    <td className="px-4 py-3">{new Date(b.startDate).toLocaleString()}</td>
                                                    <td className="px-4 py-3">{new Date(b.endDate).toLocaleString()}</td>

                                                    {/* Badge trạng thái */}
                                                    <td className="px-4 py-3">
                                                        {b.status === "PENDING" && (
                                                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-700 border border-yellow-300 w-fit">
                                                                <Clock className="h-4 w-4" /> {b.statusLabel}
                                                            </span>
                                                        )}
                                                        {b.status === "CONFIRMED" && (
                                                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700 border border-blue-300 w-fit">
                                                                <CheckCircle className="h-4 w-4" /> {b.statusLabel}
                                                            </span>
                                                        )}
                                                        {b.status === "CANCELED" && (
                                                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700 border border-red-300 w-fit">
                                                                <Ban className="h-4 w-4" /> {b.statusLabel}
                                                            </span>
                                                        )}
                                                        {b.status === "COMPLETED" && (
                                                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700 border border-green-300 w-fit">
                                                                <CheckCircle className="h-4 w-4" /> {b.statusLabel}
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 font-bold text-sky-600">
                                                        {b.totalAmount.toLocaleString()} đ
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-3 text-center flex gap-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        size="icon"
                                                                        className="bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                                                                        onClick={() => handleViewDetail(b.bookingId)}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Xem chi tiết</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        {b.status === "PENDING" && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            size="icon"
                                                                            className="bg-red-500 text-white hover:bg-red-600 rounded-full"
                                                                            onClick={() => handleCancel(b.bookingId)}
                                                                        >
                                                                            <XCircle className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Hủy đơn hàng</TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>

            {/* Modal chi tiết đơn hàng */}
            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                    </DialogHeader>

                    {detail ? (
                        <div className="space-y-3 mt-4">
                            <p><strong>Mã đơn:</strong> {detail.bookingId}</p>
                            <p><strong>Xe:</strong> {detail.carName} ({detail.brandName} - {detail.carType})</p>
                            <p><strong>Ngày nhận:</strong> {new Date(detail.startDate).toLocaleString()}</p>
                            <p><strong>Ngày trả:</strong> {new Date(detail.endDate).toLocaleString()}</p>
                            <p><strong>Trạng thái:</strong> {detail.statusLabel}</p>
                            <p><strong>Khách hàng:</strong> {detail.customerName} - {detail.customerPhone}</p>
                            <p><strong>Phương thức thanh toán:</strong> {detail.paymentMethod}</p>
                            <p><strong>Số tiền:</strong> {detail.totalAmount.toLocaleString()} đ</p>
                        </div>
                    ) : (
                        <p className="text-slate-500">Đang tải chi tiết...</p>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDetail(false)}>
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
