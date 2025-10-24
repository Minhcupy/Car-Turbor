"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getCarById, getAllCars, CarUserDTO } from "@/src/services/user/carApi"
import {
  Users,
  Fuel,
  Settings,
  Gauge,
  Calendar,
  Palette,
  Hash,
  MapPin,
  CheckCircle,
  FileCheck,
  CreditCard,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function getImageUrl(path?: string) {
  if (!path) return "/placeholder.svg"
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  return path.startsWith("http") ? path : `${BASE_URL}${path}`
}

export default function CarDetailPage() {
  const { id } = useParams()
  const [carDetails, setCarDetails] = useState<CarUserDTO | null>(null)
  const [relatedCars, setRelatedCars] = useState<CarUserDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (id) {
      getCarById(Number(id))
        .then((car) => {
          setCarDetails(car)
          getAllCars().then((cars) => {
            const related = cars.filter(
              (c) => c.typeName === car.typeName && c.carId !== car.carId
            )
            setRelatedCars(related)
          })
        })
        .catch((err) => console.error("Lỗi load car detail:", err))
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) return <p className="text-center py-10">Đang tải dữ liệu...</p>
  if (!carDetails) return <p className="text-center py-10 text-red-500">Không tìm thấy xe</p>

  const images = carDetails.gallery?.length ? carDetails.gallery : [carDetails.imageUrl]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* TOP */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Gallery */}
          <div className="space-y-3">
            <Image
              src={getImageUrl(images[currentImageIndex])}
              alt={carDetails.carName}
              width={900}
              height={500}
              className="w-full h-[450px] object-cover rounded-lg shadow"
            />
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-24 h-16 border-2 rounded ${idx === currentImageIndex ? "border-sky-600" : "border-gray-200"
                      }`}
                  >
                    <Image
                      src={getImageUrl(img)}
                      alt={`${carDetails.carName} ${idx}`}
                      width={100}
                      height={60}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <Card className="shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
            <CardContent className="space-y-6 p-6">
              {/* Tên + Giá */}
              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold text-gray-800">{carDetails.carName}</h1>
                {carDetails.status === "AVAILABLE" && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-lg">
                    Có sẵn
                  </span>
                )}
                {carDetails.status === "MAINTENANCE" && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-lg">
                    Bảo trì
                  </span>
                )}
              </div>

              {/* Giá thuê */}
              <div>
                <span className="text-3xl font-extrabold text-sky-600">
                  {carDetails.price?.toLocaleString("vi-VN")} VND
                </span>
                <span className="text-gray-500 text-sm ml-1">/ngày</span>
              </div>

              {/* Ưu đãi */}
              <div className="bg-sky-50 text-sky-700 px-4 py-2 rounded-lg text-sm w-fit font-medium shadow-sm">
                ✅ Miễn phí hủy trước 24h
              </div>

              {/* Thông số kỹ thuật */}
              <div className="grid grid-cols-2 gap-3 text-gray-700 border rounded-xl p-4 text-sm bg-gray-50">
                <div className="flex items-center space-x-2"><Users className="h-4 w-4 text-sky-600" /><span>{carDetails.seats} chỗ</span></div>
                <div className="flex items-center space-x-2"><Settings className="h-4 w-4 text-sky-600" /><span>{carDetails.transmission}</span></div>
                <div className="flex items-center space-x-2"><Gauge className="h-4 w-4 text-sky-600" /><span>{carDetails.engine || "43 HP"}</span></div>
                <div className="flex items-center space-x-2"><Fuel className="h-4 w-4 text-sky-600" /><span>{carDetails.fuelType}</span></div>
                <div className="flex items-center space-x-2"><Calendar className="h-4 w-4 text-sky-600" /><span>Năm: {carDetails.year}</span></div>
                <div className="flex items-center space-x-2"><Palette className="h-4 w-4 text-sky-600" /><span>Màu: {carDetails.color}</span></div>
                <div className="flex items-center space-x-2"><Hash className="h-4 w-4 text-sky-600" /><span>Biển số: {carDetails.licensePlate}</span></div>
                <div className="flex items-center space-x-2"><MapPin className="h-4 w-4 text-sky-600" /><span>{carDetails.location}</span></div>
              </div>

              {/* Nút đặt xe */}
              <Link href={`/user/booking?carId=${carDetails.carId}`} className="flex-1">
                <Button
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 
                   hover:from-blue-700 hover:to-indigo-700 text-white font-semibold 
                   shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
                  disabled={carDetails.status !== "AVAILABLE"}
                >
                  {carDetails.status === "AVAILABLE" ? "Đặt Ngay" : "Không khả dụng"}
                </Button>
              </Link>

              {/* Tư vấn */}
              <p className="text-sky-600 text-sm cursor-pointer hover:underline text-center">
                Nhận tư vấn trực tiếp
              </p>
            </CardContent>
          </Card>

        </div>

        {/* BOTTOM */}
        <div className="grid lg:grid-cols-2 gap-8 mt-6">
          {/* LEFT: Features + Policies */}
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold text-gray-800 text-lg">Các tiện nghi khác</h2>
              <div className="grid md:grid-cols-2 gap-3 mt-3 text-sm">
                {(carDetails.features ?? [
                  "Điều hòa tự động",
                  "Màn hình giải trí",
                  "Camera lùi",
                  "Bluetooth",
                  "Ghế da cao cấp",
                ]).map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="h-4 w-4 text-sky-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white p-6 rounded-lg shadow space-y-4 text-sm">
              <h2 className="font-semibold text-gray-800 text-lg">Điều kiện thuê xe</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-700">
                  <FileCheck className="h-4 w-4 text-sky-600" />
                  <span>CCCD hoặc Hộ chiếu còn hạn</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <FileCheck className="h-4 w-4 text-sky-600" />
                  <span>Bằng lái hợp lệ, còn hạn</span>
                </div>
              </div>

              <h2 className="font-semibold text-gray-800 text-lg mt-4">Hình thức thanh toán</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-700">
                  <CreditCard className="h-4 w-4 text-sky-600" />
                  <span>Thanh toán khi nhận xe</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <CreditCard className="h-4 w-4 text-sky-600" />
                  <span>Chuyển khoản ngân hàng</span>
                </div>
              </div>

              <h2 className="font-semibold text-gray-800 text-lg mt-4">Chính sách đặt cọc</h2>
              <div className="flex items-center space-x-2 text-gray-700">
                <Shield className="h-4 w-4 text-sky-600" />
                <span>Đặt cọc tối thiểu 5.000.000đ</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Related Cars */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Xe tương tự</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedCars.map((car) => (
                <Card
                  key={car.carId}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <CardContent className="p-0">
                    {/* Ảnh */}
                    <div className="relative">
                      <Image
                        src={getImageUrl(car.imageUrl)}
                        alt={car.carName}
                        width={400}
                        height={250}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Badge trạng thái */}
                      {car.status === "AVAILABLE" && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow">
                          Có sẵn
                        </span>
                      )}
                      {car.status === "MAINTENANCE" && (
                        <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md shadow">
                          Bảo trì
                        </span>
                      )}
                    </div>

                    {/* Nội dung */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-gray-800 text-lg group-hover:text-sky-600 transition-colors">
                        {car.carName}
                      </h3>
                      <p className="text-sky-600 font-bold">
                        {car.price?.toLocaleString("vi-VN")} VND
                        <span className="text-gray-500 text-sm font-normal"> /ngày</span>
                      </p>

                      {/* Nút hành động */}
                      <Link href={`/user/cars/${car.carId}`} className="block">
                        <Button
                          className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 
                           hover:from-blue-700 hover:to-indigo-700 text-white font-semibold 
                           shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105 rounded-lg"
                        >
                          Chi Tiết
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
