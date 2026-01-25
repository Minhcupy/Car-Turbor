"use client"

import { useEffect, useMemo, useState } from "react"
import { bookingsApi, Booking, BookingStatus, Page, ContractStatus } from "@/src/services/bookingsApi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import {
  Loader2,
  Eye,
  Trash2,
  Pencil,
  Search,
  AlertTriangle,
  FileText,
  PenLine,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ModalForm } from "@/components/ui-admin/modal-form"

const STATUS_OPTIONS: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"]

const statusVariant = (st: string) =>
    st === "CONFIRMED" ? "default" : st === "PENDING" ? "secondary" : st === "COMPLETED" ? "outline" : "destructive"

const contractBadgeVariant = (st?: ContractStatus | null) => {
  if (st === "SIGNED_DIGITAL") return "default"
  if (st === "SIGNED_ELECTRONIC") return "secondary"
  if (st === "DRAFT") return "outline"
  return "destructive"
}

function contractLabel(st?: ContractStatus | null) {
  if (!st) return "N/A"
  if (st === "DRAFT") return "Nháp"
  if (st === "SIGNED_ELECTRONIC") return "Khách đã ký"
  if (st === "SIGNED_DIGITAL") return "Đã ký số"
  if (st === "VOID") return "Hủy"
  return st
}

// ✅ helper bắt lỗi FK delete
function friendlyDeleteError(err: any) {
  const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || String(err)
  const lower = String(msg).toLowerCase()

  const isFk =
      lower.includes("foreign key constraint fails") ||
      lower.includes("cannot delete or update a parent row") ||
      lower.includes("sqlstate: 23000") ||
      lower.includes("integrityconstraintviolation")

  if (isFk) {
    return {
      title: "Không thể xóa đơn đặt xe",
      description:
          "Đơn đặt xe này đang có dữ liệu liên quan (hợp đồng / thanh toán). " +
          "Bạn nên chuyển trạng thái sang CANCELED thay vì xóa để đảm bảo lịch sử.",
    }
  }

  return { title: "Xóa thất bại", description: msg }
}

export default function PageBooking() {
  const [pageData, setPageData] = useState<Page<Booking> | null>(null)
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // ✅ popup cảnh báo lỗi
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorTitle, setErrorTitle] = useState("Lỗi")
  const [errorDesc, setErrorDesc] = useState("")

  // ✅ ký số loading
  const [signingDigital, setSigningDigital] = useState(false)

  // ✅ PDF blob states (fix 401)
  const [pdfType, setPdfType] = useState<"unsigned" | "electronic" | "digital">("digital")
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, keyword])

  useEffect(() => {
    setPage(0)
  }, [keyword])

  // ✅ load PDF qua axios -> blob -> iframe
  const loadContractPdf = async (type: "unsigned" | "electronic" | "digital") => {
    if (!selectedBooking?.contractId) return
    try {
      setPdfLoading(true)

      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl)

      const blob = await bookingsApi.getContractPdfBlob(selectedBooking.contractId, type)
      const url = URL.createObjectURL(blob)

      setPdfBlobUrl(url)
      setPdfType(type)
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Không tải được PDF"
      setErrorTitle("Lỗi tải PDF")
      setErrorDesc(String(msg))
      setErrorOpen(true)
    } finally {
      setPdfLoading(false)
    }
  }

  // ✅ mở modal hợp đồng -> tự load bản tốt nhất
  useEffect(() => {
    if (!showContractModal) return
    if (!selectedBooking?.contractId) return

    const best: "unsigned" | "electronic" | "digital" =
        selectedBooking.contractStatus === "SIGNED_DIGITAL"
            ? "digital"
            : selectedBooking.contractStatus === "SIGNED_ELECTRONIC"
                ? "electronic"
                : "unsigned"

    loadContractPdf(best)

    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl)
      setPdfBlobUrl(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showContractModal, selectedBooking?.contractId])

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      await bookingsApi.delete(deleteId)
      setPageData((prev) => (prev ? { ...prev, content: prev.content.filter((b) => b.bookingId !== deleteId) } : prev))
      setSelectedBooking(null)
    } catch (e: any) {
      const friendly = friendlyDeleteError(e)
      setErrorTitle(friendly.title)
      setErrorDesc(friendly.description)
      setErrorOpen(true)
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
          prev
              ? { ...prev, content: prev.content.map((b) => (b.bookingId === updated.bookingId ? updated : b)) }
              : prev
      )
      setShowUpdateModal(false)
    } finally {
      setSaving(false)
    }
  }

  const canAdminSignDigital = useMemo(() => {
    if (!selectedBooking?.contractId) return false
    return selectedBooking.contractStatus === "SIGNED_ELECTRONIC"
  }, [selectedBooking])

  const handleAdminSignDigital = async () => {
    if (!selectedBooking?.contractId) return
    try {
      setSigningDigital(true)
      const res = await bookingsApi.adminSignDigital(selectedBooking.contractId)

      setSelectedBooking((prev) => (prev ? { ...prev, contractStatus: res.status } : prev))
      setPageData((prev) =>
          prev
              ? {
                ...prev,
                content: prev.content.map((b) =>
                    b.bookingId === selectedBooking.bookingId ? { ...b, contractStatus: res.status } : b
                ),
              }
              : prev
      )

      // ✅ ký số xong -> reload bản digital để thấy PDF mới
      await loadContractPdf("digital")
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Ký số thất bại"
      setErrorTitle("Ký số thất bại")
      setErrorDesc(String(msg))
      setErrorOpen(true)
    } finally {
      setSigningDigital(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64">Đang tải...</div>

  const pgBtn =
      "h-8 min-w-[32px] px-2 border rounded text-sm " +
      "border-gray-300 text-gray-700 hover:bg-gray-100 " +
      "disabled:opacity-40 disabled:cursor-not-allowed"

  const pgBtnActive = "h-8 min-w-[32px] px-2 border rounded text-sm border-blue-500 bg-blue-500 text-white"

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
              <th className="px-4 py-3 text-left">Hợp đồng</th>
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

                  <td className="px-4 py-2">
                    {row.contractId ? (
                        <div className="flex items-center gap-2">
                          <Badge variant={contractBadgeVariant(row.contractStatus)}>{contractLabel(row.contractStatus)}</Badge>
                          <Button
                              size="icon"
                              variant="outline"
                              title="Xem hợp đồng"
                              onClick={() => {
                                setSelectedBooking(row)
                                setShowContractModal(true)
                              }}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                    ) : (
                        <span className="text-gray-400">Chưa có</span>
                    )}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                          size="icon"
                          variant="outline"
                          title="Chi tiết & QR"
                          onClick={() => {
                            setSelectedBooking(row)
                            setShowDetailModal(true)
                          }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                          size="icon"
                          variant="secondary"
                          title="Cập nhật"
                          onClick={() => {
                            setSelectedBooking(row)
                            setShowUpdateModal(true)
                          }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button size="icon" variant="destructive" title="Xóa" onClick={() => setDeleteId(row.bookingId)}>
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
            <span className="text-sm text-muted-foreground mr-2">
              Trang <b>{page + 1}</b>/<b>{pageData.totalPages}</b>
            </span>

                <Button className={pgBtn} variant="ghost" size="icon" disabled={pageData.first} onClick={() => setPage(0)}>
                  «
                </Button>

                <Button
                    className={pgBtn}
                    variant="ghost"
                    size="icon"
                    disabled={pageData.first}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  ‹
                </Button>

                {Array.from({ length: pageData.totalPages }).map((_, i) => (
                    <Button key={i} className={i === page ? pgBtnActive : pgBtn} variant="ghost" onClick={() => setPage(i)}>
                      {i + 1}
                    </Button>
                ))}

                <Button className={pgBtn} variant="ghost" size="icon" disabled={pageData.last} onClick={() => setPage((p) => p + 1)}>
                  ›
                </Button>

                <Button
                    className={pgBtn}
                    variant="ghost"
                    size="icon"
                    disabled={pageData.last}
                    onClick={() => setPage(pageData.totalPages - 1)}
                >
                  »
                </Button>

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
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Thông tin đơn</h3>
                  <p>
                    <b>ID:</b> {selectedBooking.bookingId}
                  </p>
                  <p>
                    <b>Khách hàng:</b> {selectedBooking.customerName}
                  </p>
                  <p>
                    <b>Xe:</b> {selectedBooking.carName}
                  </p>
                  <p>
                    <b>Thời gian:</b> {new Date(selectedBooking.pickupDate).toLocaleDateString()} →{" "}
                    {new Date(selectedBooking.returnDate).toLocaleDateString()}
                  </p>
                  <p>
                    <b>Tổng tiền:</b> {selectedBooking.totalAmount.toLocaleString()} VND
                  </p>
                  <p>
                    <b>Đặt cọc:</b> {selectedBooking.depositAmount.toLocaleString()} VND
                  </p>
                  <Badge variant={statusVariant(selectedBooking.status)}>{selectedBooking.status}</Badge>
                </div>

                <div className="flex flex-col items-center space-y-3">
                  <h3 className="font-semibold text-lg">Mã QR</h3>
                  <div className="w-48 h-48 border rounded-lg shadow-md bg-white flex items-center justify-center">
                    <Image src={bookingsApi.getQRCodeUrl(selectedBooking.bookingId)} alt="Booking QR" width={180} height={180} />
                  </div>

                  <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = bookingsApi.getQRCodeUrl(selectedBooking.bookingId)
                        link.download = `booking_${selectedBooking.bookingId}_qrcode.png`
                        link.click()
                      }}
                  >
                    Tải QR
                  </Button>
                </div>
              </div>
          )}
        </ModalForm>

        {/* ✅ Modal Hợp đồng + Admin ký số (FIX 401) */}
        <ModalForm open={showContractModal} onOpenChange={setShowContractModal} title="Hợp đồng thuê xe">
          {selectedBooking?.contractId ? (
              <div className="space-y-3 p-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <b>ContractId:</b> {selectedBooking.contractId} • <b>Trạng thái:</b>{" "}
                    <Badge variant={contractBadgeVariant(selectedBooking.contractStatus)}>{contractLabel(selectedBooking.contractStatus)}</Badge>
                  </div>

                  <Button
                      onClick={handleAdminSignDigital}
                      disabled={!canAdminSignDigital || signingDigital}
                      className="flex items-center gap-2"
                      title={!canAdminSignDigital ? "Chỉ ký số khi khách đã ký điện tử (SIGNED_ELECTRONIC)" : undefined}
                  >
                    {signingDigital ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-4 h-4" />}
                    Admin ký số
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant={pdfType === "unsigned" ? "default" : "outline"} onClick={() => loadContractPdf("unsigned")}>
                    Unsigned
                  </Button>
                  <Button variant={pdfType === "electronic" ? "default" : "outline"} onClick={() => loadContractPdf("electronic")}>
                    Electronic
                  </Button>
                  <Button variant={pdfType === "digital" ? "default" : "outline"} onClick={() => loadContractPdf("digital")}>
                    Digital
                  </Button>

                  <Button
                      variant="secondary"
                      disabled={!pdfBlobUrl}
                      onClick={() => {
                        if (!pdfBlobUrl || !selectedBooking.contractId) return
                        const a = document.createElement("a")
                        a.href = pdfBlobUrl
                        a.download = `contract_${selectedBooking.contractId}_${pdfType}.pdf`
                        a.click()
                      }}
                  >
                    Tải PDF
                  </Button>
                </div>

                <div className="rounded-xl border overflow-hidden bg-white">
                  {pdfLoading ? (
                      <div className="h-[650px] flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tải PDF...
                      </div>
                  ) : pdfBlobUrl ? (
                      <iframe src={pdfBlobUrl} className="w-full h-[650px]" />
                  ) : (
                      <div className="h-[650px] flex items-center justify-center text-sm text-muted-foreground">
                        Không có PDF để hiển thị
                      </div>
                  )}
                </div>
              </div>
          ) : (
              <div className="p-4 text-sm text-gray-500">Booking này chưa có hợp đồng.</div>
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
                      <option key={st} value={st}>
                        {st}
                      </option>
                  ))}
                </select>

                <label className="block text-sm font-medium">Ghi chú</label>
                <Input value={selectedBooking.notes || ""} onChange={(e) => setSelectedBooking({ ...selectedBooking, notes: e.target.value })} />

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

        {/* Dialog Cảnh báo lỗi */}
        <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                {errorTitle}
              </AlertDialogTitle>
              <AlertDialogDescription>{errorDesc}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setErrorOpen(false)}>Đã hiểu</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  )
}
