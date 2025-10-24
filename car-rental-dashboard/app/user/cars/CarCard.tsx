"use client"

import Link from "next/link"
import { Heart, Star, MapPin, Users, Zap, Droplets, Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ImageSlider from "./ImageSlider"
import { useState } from "react"
import type { CarUserDTO } from "@/src/services/user/carApi"

interface CarCardProps {
    car: CarUserDTO
    viewMode?: "grid" | "list"
}

export default function CarCard({ car, viewMode = "grid" }: CarCardProps) {
    const [favorites, setFavorites] = useState<number[]>([])

    const toggleFavorite = (carId: number) => {
        setFavorites((prev) =>
            prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
        )
    }

    // Xác định trạng thái
    const isAvailable = car.status === "AVAILABLE"

    // Chuẩn hóa nhiên liệu (nếu BE trả sai)
    const fuel =
        /(điện|electric|ev)/i.test(car.fuelType || "") ||
            /(điện|electric|ev)/i.test(car.engine || "")
            ? "electric"
            : "gasoline"

    return (
        <Card
            className={`overflow-hidden hover:shadow-2xl transition-all duration-500 border bg-white hover:-translate-y-1 group ${viewMode === "list" ? "flex flex-row" : ""
                }`}
        >
            {/* Ảnh xe */}
            <div className={`relative ${viewMode === "list" ? "w-80 flex-shrink-0" : ""}`}>
                <ImageSlider images={[car.imageUrl, ...(car.gallery || [])]} alt={car.carName} />

                {/* Loại xe + Nhiên liệu */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-indigo-500 text-white border-0 shadow-lg">{car.typeName}</Badge>
                    <Badge
                        className={`border-0 shadow-lg ${fuel === "electric" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                            }`}
                    >
                        {fuel === "electric" ? "⚡ Điện" : "💧 Xăng"}
                    </Badge>
                </div>

                {/* Trạng thái */}
                <div className="absolute top-4 right-4">
                    {car.status === "AVAILABLE" && (
                        <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                            Có sẵn
                        </Badge>
                    )}
                    {car.status === "MAINTENANCE" && (
                        <Badge className="bg-yellow-500 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                            Bảo trì
                        </Badge>
                    )}
                </div>

                {/* Nút yêu thích */}
                <button
                    onClick={() => toggleFavorite(car.carId)}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                >
                    <Heart
                        className={`h-5 w-5 transition-colors duration-300 ${favorites.includes(car.carId) ? "fill-red-500 text-red-500" : "text-gray-600"
                            }`}
                    />
                </button>
            </div>

            {/* Nội dung card */}
            <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                {/* Tên + Rating */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-1">
                            {car.carName}
                        </h3>
                        <p className="text-gray-500 font-medium">{car.brandName}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-800">{car.rating.toFixed(1)}</span>
                    </div>
                </div>

                {/* Giá */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-blue-600">
                        {car.price ? car.price.toLocaleString("vi-VN") + "đ / ngày" : "Liên hệ"}
                    </span>
                </div>

                {/* Địa điểm */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{car.location}</span>
                </div>

                {/* Thông số xe */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-800">{car.seats} chỗ</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-xl border border-purple-100">
                        <Settings className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-gray-800">{car.transmission || "N/A"}</span>
                    </div>
                </div>

                {/* Nút hành động */}
                <div className="flex gap-3">
                    <Link href={`/user/booking?carId=${car.carId}`} className="flex-1">
                        <Button
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
                            disabled={!isAvailable}
                        >
                            {isAvailable ? "Đặt Ngay" : "Không khả dụng"}
                        </Button>
                    </Link>

                    <Link href={`/user/cars/${car.carId}`}>
                        <Button
                            variant="outline"
                            className="h-12 px-6 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-105 rounded-xl font-semibold bg-transparent"
                        >
                            Chi Tiết
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
