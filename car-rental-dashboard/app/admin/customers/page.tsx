
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash, Search } from "lucide-react";
import { CustomerSummary, deleteCustomer, getCustomers } from "../../../src/services/customersApi";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadCustomers = async () => {
    const data = await getCustomers(keyword, page, size) as { content: CustomerSummary[], totalPages: number, totalElements: number };
    setCustomers(data.content);
    setTotalPages(data.totalPages);
    setTotalElements(data.totalElements);
  };

  useEffect(() => {
    loadCustomers();
  }, [page, keyword]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    await deleteCustomer(id);
    loadCustomers();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Quản lý khách hàng</h2>
        <p className="text-muted-foreground text-sm">Xem và quản lý danh sách khách hàng đã thuê xe.</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, email, SĐT..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => loadCustomers()}>Tìm kiếm</Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Lần thuê gần nhất</TableHead>
              <TableHead>Xe gần nhất</TableHead>
              <TableHead className="text-center">Số lần thuê</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.customerId} className="hover:bg-muted/50">
                <TableCell className="font-medium">{c.customerName}</TableCell>
                <TableCell>{c.customerEmail}</TableCell>
                <TableCell>{c.customerPhone}</TableCell>
                <TableCell>{c.customerAddress}</TableCell>
                <TableCell>
                  <Badge variant={c.status === "ACTIVE" ? "default" : "secondary"}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {c.lastBookingDate ? new Date(c.lastBookingDate).toLocaleString("vi-VN") : "-"}
                </TableCell>
                <TableCell>{c.lastCarName || "-"}</TableCell>
                <TableCell className="text-center font-semibold">{c.totalBookings}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Tổng số khách hàng: {totalElements}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Trước</Button>
          <span className="px-2 py-1 border rounded text-sm">
            Trang {page + 1} / {totalPages}
          </span>
          <Button variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Sau</Button>
        </div>
      </div>
    </div>
  );
}
