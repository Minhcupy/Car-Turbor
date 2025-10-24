"use client"

import Image from "next/image"
import {
    Car,
    ArrowRight,
    Star,
    Users,
    Fuel,
    Cog,
    MapPin,
    Calendar,
    Palette,
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CarItem } from "@/src/services/user/apiBookingUserService "

interface Step1CarSelectionProps {
    selectedCar: CarItem
    nextStep: () => void
}

export default function Step1CarSelection({
    selectedCar,
    nextStep,
}: Step1CarSelectionProps) {
    // Fix đường dẫn ảnh BE
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const mainImage = selectedCar.imageUrl
        ? `${baseUrl}${selectedCar.imageUrl}`
        : "/placeholder.svg"

    return (
        <TooltipProvider>
            <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
                {/* LEFT: Chi tiết xe */}
                <div className="lg:col-span-2">
                    <Card className="border-sky-100 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center text-gray-800">
                                <Car className="h-6 w-6 mr-2 text-sky-500" /> Xe đã chọn
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-xl">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Hình ảnh */}
                                    <div className="md:w-1/2">
                                        <Image
                                            src={mainImage}
                                            alt={selectedCar.carName}
                                            width={400}
                                            height={250}
                                            className="w-full h-56 object-cover rounded-lg shadow-md"
                                        />
                                        {/* Gallery nhỏ */}
                                        {(selectedCar.gallery ?? []).length > 0 && (
                                            <div className="flex gap-2 mt-3">
                                                {(selectedCar.gallery ?? []).map((img, i) => (
                                                    <Image
                                                        key={i}
                                                        src={`${baseUrl}${img}`}
                                                        alt={`gallery-${i}`}
                                                        width={80}
                                                        height={60}
                                                        className="rounded-md object-cover border border-sky-100 hover:scale-105 transition-transform"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {/* Thông tin */}
                                    <div className="md:w-1/2 space-y-4">
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            {selectedCar.carName}
                                        </h3>
                                        <p className="text-gray-600">
                                            {selectedCar.brandName} • {selectedCar.typeName}
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center mt-2">
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="ml-1 text-sm text-gray-600">
                                                {selectedCar.rating ?? 0}
                                            </span>
                                        </div>

                                        {/* Thông số với Tooltip */}
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <Users className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.seats} chỗ
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Số ghế ngồi</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <Fuel className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.fuelType}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Loại nhiên liệu</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <Cog className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.transmission}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Hộp số</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <MapPin className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.location}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Vị trí xe</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <Calendar className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.year}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Năm sản xuất</p>
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <Palette className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.color}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Màu sắc</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>

                                        {/* Giá */}
                                        <div className="text-3xl font-bold text-sky-600 mt-3">
                                            {selectedCar.price.toLocaleString("vi-VN")}đ
                                            <span className="text-sm text-gray-500 font-normal">
                                                /ngày
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT: Tóm tắt */}
                <div>
                    <Card className="border-sky-100 shadow-lg sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-gray-800">Tóm tắt đặt xe</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Xe đã chọn:</span>
                                <span className="font-medium">{selectedCar.carName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Hãng:</span>
                                <span className="font-medium">{selectedCar.brandName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Giá thuê:</span>
                                <span className="font-medium">
                                    {selectedCar.price.toLocaleString("vi-VN")}đ/ngày
                                </span>
                            </div>
                            <div className="border-t pt-4">
                                <Button
                                    onClick={nextStep}
                                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                                >
                                    Tiếp tục đặt xe <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TooltipProvider>
    )
}
