"use client"

import { useEffect, useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Trash, Search, Eye } from "lucide-react"

import {
  CustomerSummary,
  deleteCustomer,
  getCustomers
} from "@/src/services/customersApi"

import {
  AdminFaceDTO,
  getCustomerFace,
  resetCustomerFace
} from "@/src/services/adminFaceApi"

/* ===================== Types ===================== */
type FaceStatus = "MISSING" | "WEAK" | "ACTIVE"

/* ===================== Component ===================== */
export default function CustomersPage() {
  /* ---------- Data ---------- */
  const [customers, setCustomers] = useState<CustomerSummary[]>([])
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(0)
  const size = 10

  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  /* ---------- Face ---------- */
  const [faceMap, setFaceMap] = useState<Record<number, FaceStatus>>({})
  const [faceDetail, setFaceDetail] = useState<AdminFaceDTO | null>(null)

  /* ===================== Load ===================== */
  const loadCustomers = async () => {
    const data = await getCustomers(keyword, page, size)

    setCustomers(data.content)
    setTotalPages(data.totalPages)
    setTotalElements(data.totalElements)

    const map: Record<number, FaceStatus> = {}

    await Promise.all(
        data.content.map(async (c) => {
          try {
            const face = await getCustomerFace(c.customerId)

            if (!face.registered) {
              map[c.customerId] = "MISSING"
            } else if ((face.qualityScore ?? 0) < 0.65) {
              map[c.customerId] = "WEAK"
            } else {
              map[c.customerId] = "ACTIVE"
            }
          } catch {
            map[c.customerId] = "MISSING"
          }
        })
    )

    setFaceMap(map)
  }

  useEffect(() => {
    loadCustomers()
  }, [page, keyword])

  useEffect(() => {
    setPage(0)
  }, [keyword])

  /* ===================== Actions ===================== */
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return
    await deleteCustomer(id)
    loadCustomers()
  }

  const openFaceDetail = async (userId: number) => {
    const data = await getCustomerFace(userId)
    setFaceDetail(data)
  }

  const pgBtn =
      "h-8 min-w-[32px] px-2 border rounded text-sm " +
      "border-gray-300 text-gray-700 hover:bg-gray-100 " +
      "disabled:opacity-40 disabled:cursor-not-allowed"

  const pgBtnActive =
      "h-8 min-w-[32px] px-2 border rounded text-sm " +
      "border-blue-500 bg-blue-500 text-white"

  /* ===================== Render ===================== */
  return (
      <div className="p-6 space-y-6">
        {/* ===== Header ===== */}
        <div>
          <h2 className="text-2xl font-bold">Quản lý khách hàng</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý thông tin khách hàng & khuôn mặt xác thực
          </p>
        </div>

        {/* ===== Search ===== */}
        <div className="flex gap-2">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Tên, email, SĐT..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-8"
            />
          </div>
          <Button onClick={loadCustomers}>Tìm kiếm</Button>
        </div>

        {/* ===== Table ===== */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Face</TableHead>
                <TableHead className="text-center">Số lần thuê</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {customers.map((c) => (
                  <TableRow key={c.customerId}>
                    <TableCell className="font-medium">{c.customerName}</TableCell>
                    <TableCell>{c.customerEmail}</TableCell>
                    <TableCell>{c.customerPhone}</TableCell>

                    <TableCell>
                      <Badge variant={c.status === "ACTIVE" ? "default" : "secondary"}>
                        {c.status}
                      </Badge>
                    </TableCell>

                    {/* Face Status */}
                    <TableCell className="text-center">
                      {faceMap[c.customerId] === "ACTIVE" && (
                          <Badge className="bg-green-500">Active</Badge>
                      )}
                      {faceMap[c.customerId] === "WEAK" && (
                          <Badge className="bg-yellow-500 text-black">Weak</Badge>
                      )}
                      {faceMap[c.customerId] === "MISSING" && (
                          <Badge variant="secondary">Chưa có</Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-center font-semibold">
                      {c.totalBookings}
                    </TableCell>

                    <TableCell className="text-center space-x-2">
                      <Button
                          size="icon"
                          variant="outline"
                          onClick={() => openFaceDetail(c.customerId)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDelete(c.customerId)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination (giống Booking) */}
        {totalPages > 0 && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2">
                {/* Trang x/y */}
                <span className="text-sm text-muted-foreground mr-2">
        Trang <b>{page + 1}</b>/<b>{totalPages}</b>
      </span>

                {/* Về đầu */}
                <Button
                    className={pgBtn}
                    variant="ghost"
                    size="icon"
                    disabled={page === 0}
                    onClick={() => setPage(0)}
                >
                  «
                </Button>

                {/* Lùi 1 */}
                <Button
                    className={pgBtn}
                    variant="ghost"
                    size="icon"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  ‹
                </Button>

                {/* Các nút số trang */}
                {Array.from({ length: totalPages }).map((_, i) => (
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
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                >
                  ›
                </Button>

                {/* Về cuối */}
                <Button
                    className={pgBtn}
                    variant="ghost"
                    size="icon"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(totalPages - 1)}
                >
                  »
                </Button>

                {/* Tổng */}
                <span className="text-sm text-muted-foreground ml-2">
                  Tổng: <b>{totalElements}</b> khách hàng
                </span>
              </div>
            </div>
        )}

        {/* ===== Face Modal ===== */}
        {faceDetail && (
            <Dialog open onOpenChange={() => setFaceDetail(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    Thông tin khuôn mặt
                    <span
                        title="Hệ thống không lưu ảnh gốc, chỉ lưu vector sinh trắc học để bảo vệ quyền riêng tư"
                        className="cursor-help text-muted-foreground"
                    >
                </span>
                  </DialogTitle>
                </DialogHeader>

                {!faceDetail.registered ? (
                    <p className="text-red-600">Khách hàng chưa đăng ký khuôn mặt</p>
                ) : (
                    <div className="space-y-2 text-sm">
                      <p><b>Model:</b> {faceDetail.model}</p>
                      <p><b>Dim:</b> {faceDetail.dim}</p>
                      <p><b>Version:</b> {faceDetail.version}</p>

                      <p>
                        <b>Quality:</b>{" "}
                        {faceDetail.qualityScore != null ? (
                            faceDetail.qualityScore >= 0.8 ? (
                                <span className="text-green-600 font-semibold">
                        Tốt ({faceDetail.qualityScore})
                      </span>
                            ) : faceDetail.qualityScore >= 0.65 ? (
                                <span className="text-yellow-600 font-semibold">
                        Trung bình ({faceDetail.qualityScore})
                      </span>
                            ) : (
                                <span className="text-red-600 font-semibold">
                        Kém ({faceDetail.qualityScore})
                      </span>
                            )
                        ) : (
                            "—"
                        )}
                      </p>

                      <p>
                        <b>Ngày tạo:</b>{" "}
                        {new Date(faceDetail.createdAt!).toLocaleString("vi-VN")}
                      </p>

                      <Button
                          variant="destructive"
                          onClick={async () => {
                            if (!confirm("Reset khuôn mặt khách hàng?")) return
                            await resetCustomerFace(faceDetail.userId)
                            setFaceDetail(null)
                            loadCustomers()
                          }}
                      >
                        Reset khuôn mặt
                      </Button>
                    </div>
                )}
              </DialogContent>
            </Dialog>
        )}
      </div>
  )
}
