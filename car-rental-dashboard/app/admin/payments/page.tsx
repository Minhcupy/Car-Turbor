"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui-admin/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiPayment, PaymentDTO, PageResponse, PaymentStatus } from "@/src/services/apiPayment"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PaymentsPage() {
  const [pageData, setPageData] = useState<PageResponse<PaymentDTO> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const pageSize = 10

  // state tìm kiếm + filter
  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState<PaymentStatus | undefined>(undefined)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const data = await apiPayment.getPage(page, pageSize, keyword, status)
      setPageData(data)
    } catch (error) {
      console.error("Failed to fetch payments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [page, status])

  const handleSearch = () => {
    setPage(0) // reset về trang đầu
    fetchPayments()
  }

  const handleStatusChange = async (id: number, newStatus: PaymentStatus) => {
    await apiPayment.updateStatus(id, newStatus)
    fetchPayments()
  }

  const handleRefund = async (payment: PaymentDTO) => {
    if (confirm(`Xác nhận hoàn tiền cho giao dịch #${payment.paymentId}?`)) {
      await apiPayment.updateStatus(payment.paymentId, "REFUNDED")
      fetchPayments()
    }
  }

  const handleDelete = async (payment: PaymentDTO) => {
    if (confirm(`Bạn có chắc chắn muốn xóa giao dịch #${payment.paymentId}?`)) {
      await apiPayment.delete(payment.paymentId)
      fetchPayments()
    }
  }

  const columns = [
    { key: "paymentId", label: "Mã giao dịch" },
    { key: "bookingId", label: "Mã đặt xe" },
    { key: "customerName", label: "Khách hàng" },
    { key: "carName", label: "Xe" },
    {
      key: "amount",
      label: "Số tiền",
      render: (value: number) => `${value.toLocaleString()} VND`,
    },
    { key: "method", label: "Phương thức" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value: string, row: PaymentDTO) => (
        <Select
          defaultValue={value}
          onValueChange={(newStatus) =>
            handleStatusChange(row.paymentId, newStatus as PaymentStatus)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="SUCCESS">SUCCESS</SelectItem>
            <SelectItem value="FAILED">FAILED</SelectItem>
            <SelectItem value="REFUNDED">REFUNDED</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "paymentDate",
      label: "Ngày thanh toán",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Hành động",
      render: (_: any, row: PaymentDTO) => (
        <div className="flex space-x-2">
          {row.status === "SUCCESS" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleRefund(row)}
            >
              Hoàn tiền
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ]

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý thanh toán</h1>
          <p className="text-muted-foreground">
            Tìm kiếm, lọc và thay đổi trạng thái giao dịch.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Tìm khách hàng hoặc xe..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-[250px]"
          />
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" /> Tìm kiếm
          </Button>

          <Select
            value={status}
            onValueChange={(v) => setStatus(v === "ALL" ? undefined : (v as PaymentStatus))}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="SUCCESS">SUCCESS</SelectItem>
              <SelectItem value="FAILED">FAILED</SelectItem>
              <SelectItem value="REFUNDED">REFUNDED</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable data={pageData?.content || []} columns={columns} searchable={false} />

      {/* Phân trang */}
      {pageData && pageData.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Trang trước
          </Button>

          <span className="text-sm">
            Trang {page + 1} / {pageData.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(pageData.totalPages - 1, p + 1))
            }
            disabled={page === pageData.totalPages - 1}
          >
            Trang sau <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
