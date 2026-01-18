"use client"

import { useEffect, useState } from "react"
import { bookingsApi, Booking, Page, BookingStatus } from "@/src/services/bookingsApi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, Trash2, Pencil, Search } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { ModalForm } from "@/components/ui-admin/modal-form"
import Image from "next/image"

const STATUS_OPTIONS: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"]

const statusVariant = (st: string) =>
  st === "CONFIRMED" ? "default"
    : st === "PENDING" ? "secondary"
      : st === "COMPLETED" ? "outline"
        : "destructive"

export default function PageBooking() {
  const [pageData, setPageData] = useState<Page<Booking> | null>(null)
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [pageInput, setPageInput] = useState("1")

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingsApi.getPage(page, pageSize, keyword)
      setPageData(data)
    } catch (e) {
      console.error("Fetch failed:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [page, keyword])

  useEffect(() => {
    setPageInput(String(page + 1))
  }, [page])

  useEffect(() => {
    setPage(0)
  }, [keyword])

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      await bookingsApi.delete(deleteId)
      setPageData((prev) =>
        prev ? { ...prev, content: prev.content.filter((b) => b.bookingId !== deleteId) } : prev
      )
      setSelectedBooking(null)
    } catch (e) {
      console.error("Delete failed:", e)
    } finally {
      setDeleteLoading(false)
      setDeleteId(null)
    }
  }

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return
    setSaving(true)
    try {
      const updated = await bookingsApi.updateStatus(selectedBooking.bookingId, selectedBooking.status)
      setPageData((prev) =>
        prev ? {
          ...prev,
          content: prev.content.map((b) =>
            b.bookingId === updated.bookingId ? updated : b
          )
        } : prev
      )
      setShowUpdateModal(false)
    } catch (e) {
      console.error("Update failed:", e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64">Đang tải...</div>

  const pgBtn =
      "h-8 min-w-[32px] px-2 border rounded text-sm " +
      "border-gray-300 text-gray-700 hover:bg-gray-100 " +
      "disabled:opacity-40 disabled:cursor-not-allowed"

  const pgBtnActive =
      "h-8 min-w-[32px] px-2 border rounded text-sm " +
      "border-blue-500 bg-blue-500 text-white"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">📅 Quản lý Đặt Xe</h1>
          <p className="text-muted-foreground">Theo dõi, xem chi tiết và quản lý các đơn đặt xe trong hệ thống.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Tìm khách hàng hoặc xe..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => fetchBookings()}>
            <Search className="w-4 h-4 mr-2" /> Tìm
          </Button>
        </div>
      </div>

      {/* Bảng */}
      <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Khách hàng</th>
              <th className="px-4 py-3 text-left">Xe</th>
              <th className="px-4 py-3 text-left">Ngày nhận</th>
              <th className="px-4 py-3 text-left">Ngày trả</th>
              <th className="px-4 py-3 text-left">Tổng tiền</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pageData?.content.map((row) => (
              <tr key={row.bookingId} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{row.bookingId}</td>
                <td className="px-4 py-2">{row.customerName}</td>
                <td className="px-4 py-2">{row.carName}</td>
                <td className="px-4 py-2">{new Date(row.pickupDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(row.returnDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 font-semibold">{row.totalAmount.toLocaleString()} VND</td>
                <td className="px-4 py-2">
                  <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <Button size="icon" variant="outline" title="Chi tiết & QR"
                      onClick={() => { setSelectedBooking(row); setShowDetailModal(true) }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" title="Cập nhật"
                      onClick={() => { setSelectedBooking(row); setShowUpdateModal(true) }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" title="Xóa"
                      onClick={() => setDeleteId(row.bookingId)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageData && pageData.totalPages > 0 && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
              {/* Trang x / y */}
              <span className="text-sm text-muted-foreground mr-2">
        Trang <b>{page + 1}</b>/<b>{pageData.totalPages}</b>
      </span>

              {/* Về đầu */}
              <Button
                  className={pgBtn}
                  variant="ghost"
                  size="icon"
                  disabled={pageData.first || loading}
                  onClick={() => setPage(0)}
              >
                «
              </Button>

              {/* Lùi 1 */}
              <Button
                  className={pgBtn}
                  variant="ghost"
                  size="icon"
                  disabled={pageData.first || loading}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                ‹
              </Button>

              {/* Các nút số trang */}
              {Array.from({ length: pageData.totalPages }).map((_, i) => (
                  <Button
                      key={i}
                      className={i === page ? pgBtnActive : pgBtn}
                      variant="ghost"
                      onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </Button>
              ))}

              {/* Tiến 1 */}
              <Button
                  className={pgBtn}
                  variant="ghost"
                  size="icon"
                  disabled={pageData.last || loading}
                  onClick={() => setPage((p) => p + 1)}
              >
                ›
              </Button>

              {/* Về cuối */}
              <Button
                  className={pgBtn}
                  variant="ghost"
                  size="icon"
                  disabled={pageData.last || loading}
                  onClick={() => setPage(pageData.totalPages - 1)}
              >
                »
              </Button>

              {/* Tổng */}
              <span className="text-sm text-muted-foreground ml-2">
        Tổng: <b>{pageData.totalElements}</b> đơn
      </span>
            </div>
          </div>
      )}

      {/* Modal Chi tiết + QR */}
      <ModalForm open={showDetailModal} onOpenChange={setShowDetailModal} title="Chi tiết đơn đặt xe">
        {selectedBooking && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            {/* Thông tin đơn */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Thông tin đơn</h3>
              <p><b>ID:</b> {selectedBooking.bookingId}</p>
              <p><b>Khách hàng:</b> {selectedBooking.customerName}</p>
              <p><b>Xe:</b> {selectedBooking.carName}</p>
              <p><b>Thời gian:</b> {new Date(selectedBooking.pickupDate).toLocaleDateString()} → {new Date(selectedBooking.returnDate).toLocaleDateString()}</p>
              <p><b>Tổng tiền:</b> {selectedBooking.totalAmount.toLocaleString()} VND</p>
              <p><b>Đặt cọc:</b> {selectedBooking.depositAmount.toLocaleString()} VND</p>
              <Badge variant={statusVariant(selectedBooking.status)}>{selectedBooking.status}</Badge>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center space-y-3">
              <h3 className="font-semibold text-lg">Mã QR</h3>
              <div className="w-48 h-48 border rounded-lg shadow-md bg-white flex items-center justify-center">
                <Image
                  src={bookingsApi.getQRCodeUrl(selectedBooking.bookingId)}
                  alt="Booking QR"
                  width={180}
                  height={180}
                />
              </div>
              <Button variant="outline" onClick={() => {
                const link = document.createElement("a")
                link.href = bookingsApi.getQRCodeUrl(selectedBooking.bookingId)
                link.download = `booking_${selectedBooking.bookingId}_qrcode.png`
                link.click()
              }}>
                Tải QR
              </Button>
            </div>
          </div>
        )}
      </ModalForm>

      {/* Modal Cập nhật */}
      <ModalForm open={showUpdateModal} onOpenChange={setShowUpdateModal} title="Cập nhật đơn đặt xe">
        {selectedBooking && (
          <div className="space-y-4 p-2">
            <label className="block text-sm font-medium">Trạng thái</label>
            <select
              value={selectedBooking.status}
              onChange={(e) => setSelectedBooking({ ...selectedBooking, status: e.target.value as BookingStatus })}
              className="border rounded p-2 w-full"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            <label className="block text-sm font-medium">Ghi chú</label>
            <Input
              value={selectedBooking.notes || ""}
              onChange={(e) => setSelectedBooking({ ...selectedBooking, notes: e.target.value })}
            />
            <Button onClick={handleUpdateBooking} disabled={saving} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu thay đổi"}
            </Button>
          </div>
        )}
      </ModalForm>

      {/* Dialog Xóa */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa đơn đặt xe</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn chắc chắn muốn xóa đơn <b>{deleteId}</b>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
