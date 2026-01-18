"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
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
import { Pricing, userPricingApi } from "@/src/services/user/pricingApi"

interface Step1CarSelectionProps {
    selectedCar: CarItem
    nextStep: () => void

    // ✅ nhận từ BookingPage (component cha)
    selectedPricingId: number | null
    setSelectedPricingId: React.Dispatch<React.SetStateAction<number | null>>

    selectedPricing: Pricing | null
    setSelectedPricing: React.Dispatch<React.SetStateAction<Pricing | null>>
}

function unitLabel(unit?: string) {
    switch (unit) {
        case "HOUR":
            return "giờ"
        case "DAY":
            return "ngày"
        case "WEEK":
            return "tuần"
        case "MONTH":
            return "tháng"
        default:
            return unit ?? ""
    }
}

export default function Step1CarSelection({
                                              selectedCar,
                                              nextStep,
                                              selectedPricingId,
                                              setSelectedPricingId,
                                              selectedPricing,
                                              setSelectedPricing,
                                          }: Step1CarSelectionProps) {
    const searchParams = useSearchParams()
    const pricingIdFromUrl = searchParams.get("pricingId")

    const pricingIdNumber = useMemo(() => {
        if (!pricingIdFromUrl) return null
        const n = Number(pricingIdFromUrl)
        return Number.isNaN(n) ? null : n
    }, [pricingIdFromUrl])

    const [pricings, setPricings] = useState<Pricing[]>([])

    const mainImage = selectedCar.imageUrl ? `${selectedCar.imageUrl}` : "/placeholder.svg"

    // ✅ load pricing theo carId + set mặc định
    useEffect(() => {
        if (!selectedCar?.carId) return

            ;(async () => {
            try {
                const list = await userPricingApi.getByCar(selectedCar.carId)
                setPricings(list)

                // 1) Ưu tiên pricingId trên URL nếu tồn tại
                if (pricingIdNumber && list.some((p) => p.pricingId === pricingIdNumber)) {
                    const chosen = list.find((p) => p.pricingId === pricingIdNumber) ?? null
                    setSelectedPricingId(chosen?.pricingId ?? null)
                    setSelectedPricing(chosen)
                    return
                }

                // 2) Nếu cha đã có selectedPricingId mà còn tồn tại trong list -> giữ nguyên
                if (selectedPricingId && list.some((p) => p.pricingId === selectedPricingId)) {
                    const chosen = list.find((p) => p.pricingId === selectedPricingId) ?? null
                    setSelectedPricing(chosen)
                    return
                }

                // 3) Mặc định: ưu tiên DAY
                const day = list.find((p) => p.unit === "DAY")
                const chosen = day ?? list[0] ?? null
                setSelectedPricingId(chosen?.pricingId ?? null)
                setSelectedPricing(chosen)
            } catch (e) {
                console.error("Lỗi load pricing:", e)
                setPricings([])
                setSelectedPricingId(null)
                setSelectedPricing(null)
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCar?.carId, pricingIdNumber])

    const displayPrice = selectedPricing?.price ?? selectedCar.price ?? 0
    const displayUnit = unitLabel(selectedPricing?.unit) || "ngày"

    return (
        <TooltipProvider>
            <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
                {/* LEFT */}
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
                                    {/* Image */}
                                    <div className="md:w-1/2">
                                        <Image
                                            src={mainImage}
                                            alt={selectedCar.carName}
                                            width={400}
                                            height={250}
                                            className="w-full h-56 object-cover rounded-lg shadow-md"
                                        />

                                        {(selectedCar.gallery ?? []).length > 0 && (
                                            <div className="flex gap-2 mt-3">
                                                {(selectedCar.gallery ?? []).map((img, i) => (
                                                    <Image
                                                        key={i}
                                                        src={`${img}`}
                                                        alt={`gallery-${i}`}
                                                        width={80}
                                                        height={60}
                                                        className="rounded-md object-cover border border-sky-100 hover:scale-105 transition-transform"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="md:w-1/2 space-y-4">
                                        <h3 className="text-2xl font-bold text-gray-800">{selectedCar.carName}</h3>
                                        <p className="text-gray-600">
                                            {selectedCar.brandName} • {selectedCar.typeName}
                                        </p>

                                        <div className="flex items-center mt-2">
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="ml-1 text-sm text-gray-600">{selectedCar.rating ?? 0}</span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <Users className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.seats} chỗ
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Số ghế ngồi</p></TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <Fuel className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.fuelType}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Loại nhiên liệu</p></TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <Cog className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.transmission}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Hộp số</p></TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <MapPin className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.location}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Vị trí xe</p></TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <Calendar className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.year}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Năm sản xuất</p></TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                                        <Palette className="h-4 w-4 text-sky-500" />
                                                        {selectedCar.color}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Màu sắc</p></TooltipContent>
                                            </Tooltip>
                                        </div>

                                        {/* Giá + kiểu thuê */}
                                        <div className="mt-3 space-y-2">
                                            <div className="text-3xl font-bold text-sky-600">
                                                {displayPrice.toLocaleString("vi-VN")}đ
                                                <span className="text-sm text-gray-500 font-normal">/{displayUnit}</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-600 min-w-[70px]">Kiểu thuê</span>
                                                <select
                                                    className="h-10 rounded-lg border border-sky-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
                                                    value={selectedPricingId ?? ""}
                                                    onChange={(e) => {
                                                        const id = Number(e.target.value)
                                                        const chosen = pricings.find((p) => p.pricingId === id) ?? null
                                                        setSelectedPricingId(chosen?.pricingId ?? null)
                                                        setSelectedPricing(chosen)
                                                    }}
                                                    disabled={pricings.length === 0}
                                                >
                                                    {pricings.length === 0 ? (
                                                        <option value="">Chưa có giá</option>
                                                    ) : (
                                                        pricings.map((p) => (
                                                            <option key={p.pricingId} value={p.pricingId}>
                                                                {unitLabel(p.unit)} - {p.price.toLocaleString("vi-VN")}đ
                                                            </option>
                                                        ))
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT */}
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
                  {displayPrice.toLocaleString("vi-VN")}đ/{displayUnit}
                </span>
                            </div>

                            <div className="border-t pt-4">
                                <Button
                                    onClick={nextStep}
                                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                                    disabled={!selectedPricingId}
                                    title={!selectedPricingId ? "Vui lòng chọn kiểu thuê" : undefined}
                                >
                                    Tiếp tục đặt xe <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>

                            {!selectedPricingId && (
                                <p className="text-sm text-red-600">
                                    Vui lòng chọn kiểu thuê để tiếp tục.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TooltipProvider>
    )
}
