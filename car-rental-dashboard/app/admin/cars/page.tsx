"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { carsApi, type Car, type CarPage } from "@/src/services/carsApi"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Badge } from "@/components/ui-admin/badge"
import { Pencil, Trash2, Plus, Tag } from "lucide-react"
import { ModalCarForm } from "./ModalCarForm"   // 👈 import modal

export default function CarsPage() {
  const [carPage, setCarPage] = useState<CarPage | null>(null)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [editCar, setEditCar] = useState<Car | null>(null)
  const [openForm, setOpenForm] = useState(false)

  const loadCars = async () => {
    const res = await carsApi.fetchPage(page, 5, keyword)
    setCarPage(res)
  }

  useEffect(() => {
    loadCars()
  }, [page, keyword])

  useEffect(() => {
    setPage(1)
  }, [keyword])

  const handleOpenCreate = () => {
    setEditCar(null)
    setOpenForm(true)
  }

  const handleOpenEdit = (car: Car) => {
    setEditCar(car)
    setOpenForm(true)
  }

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
            <h1 className="text-3xl font-bold tracking-tight">🚗 Quản lý Xe</h1>
            <p className="text-muted-foreground">
              Theo dõi, thêm mới và cập nhật thông tin xe trong hệ thống.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
                placeholder="Tìm xe theo tên, hãng..."
                className="max-w-xs"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <Button onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" /> Thêm xe
            </Button>
          </div>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Ảnh</th>
              <th className="px-4 py-3 text-left">Tên xe</th>
              <th className="px-4 py-3 text-left">Loại</th>
              <th className="px-4 py-3 text-left">Hãng</th>
              <th className="px-4 py-3 text-center">Số lượng</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {carPage?.content.map((car) => (
                <tr key={car.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                    {car.primaryImage ? (
                        <Image
                            src={`${car.primaryImage}`}
                            alt={car.carName}
                            width={70}
                            height={45}
                            className="rounded-md object-cover border"
                        />
                    ) : (
                        <span className="text-gray-400 italic">Không có ảnh</span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium">{car.carName}</td>
                  <td className="px-4 py-2">{car.carTypeName}</td>
                  <td className="px-4 py-2">{car.brandName}</td>
                  <td className="px-4 py-2 text-center">{car.quantity}</td>
                  <td className="px-4 py-2 text-center">
                    <Badge
                        className={
                          car.status === "AVAILABLE"
                              ? "bg-green-500"
                              : car.status === "RENTED"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                        }
                    >
                      {car.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      {/* Sửa xe */}
                      <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => handleOpenEdit(car)}
                          title="Sửa xe"
                      >
                        <Pencil className="w-4 h-4"/>
                      </Button>

                      {/* Pricing */}
                      <Link href={`/admin/cars/pricing?carId=${car.id}`}>
                        <Button
                            size="icon"
                            variant="outline"
                            title="Quản lý giá"
                        >
                          <Tag className="w-4 h-4"/>
                        </Button>
                      </Link>

                      {/* Xóa xe */}
                      <Button
                          size="icon"
                          variant="destructive"
                          onClick={async () => {
                            await carsApi.delete(car.id)
                            loadCars()
                          }}
                          title="Xóa xe"
                      >
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (giống Booking) */}
        {carPage && carPage.totalPages > 0 && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2">
                {/* Trang x / y */}
                <span className="text-sm text-muted-foreground mr-2">
        Trang <b>{page}</b>/<b>{carPage.totalPages}</b>
      </span>

                {/* Về đầu */}
                <Button
                    className={pgBtn}
                    variant="ghost"
                    size="icon"
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                >
                  «
                </Button>

                {/* Lùi 1 */}
                <Button
                    className={pgBtn}
                    variant="ghost"
                    size="icon"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ‹
                </Button>

                {/* Các nút số trang */}
                {Array.from({ length: carPage.totalPages }).map((_, i) => (
                    <Button
                        key={i}
                        className={i + 1 === page ? pgBtnActive : pgBtn}
                        variant="ghost"
                        onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                ))}

                {/* Tiến 1 */}
                <Button
                    className={pgBtn}
                    variant="ghost"
                    size="icon"
                    disabled={page === carPage.totalPages}
                    onClick={() => setPage((p) => Math.min(carPage.totalPages, p + 1))}
                >
                  ›
                </Button>

                {/* Về cuối */}
                <Button
                    className={pgBtn}
                    variant="ghost"
                    size="icon"
                    disabled={page === carPage.totalPages}
                    onClick={() => setPage(carPage.totalPages)}
                >
                  »
                </Button>

                {/* Tổng */}
                <span className="text-sm text-muted-foreground ml-2">
        Tổng: <b>{carPage.totalElements}</b> xe
      </span>
              </div>
            </div>
        )}

        {/* 👉 Dùng ModalCarForm ở đây */}
        {openForm && (
            <ModalCarForm
                car={editCar}
                onClose={() => setOpenForm(false)}
                onSaved={loadCars}
            />
        )}
      </div>
  )
}
