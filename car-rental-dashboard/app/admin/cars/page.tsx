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

  const handleOpenCreate = () => {
    setEditCar(null)
    setOpenForm(true)
  }

  const handleOpenEdit = (car: Car) => {
    setEditCar(car)
    setOpenForm(true)
  }

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

        {/* Phân trang */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
          >
            ← Trước
          </Button>
          {Array.from({length: carPage?.totalPages || 1}, (_, i) => (
              <Button
                  key={i}
                  size="sm"
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
          ))}
          <Button
              size="sm"
              variant="outline"
              disabled={page === (carPage?.totalPages || 1)}
              onClick={() => setPage(page + 1)}
          >
            Sau →
          </Button>
        </div>

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
