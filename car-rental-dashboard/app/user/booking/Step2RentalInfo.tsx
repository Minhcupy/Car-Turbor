"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Car, ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

import {
    bookingApi,
    BookingRequestDTO,
    BookingPreviewDTO,
    CarItem,
    // nếu bạn export type ở service thì import thêm BusySlotDTO/AvailabilityDTO cho đẹp
} from "@/src/services/user/apiBookingUserService "

interface BusySlotDTO {
    startDT: string
    endDT: string
    status: string
}

interface AvailabilityDTO {
    available: boolean
    availableUnits: number
    busyUnits: number
    baseAvailable: number
    message: string
    busySlots: BusySlotDTO[]
}

interface Step2RentalInfoProps {
    selectedCar: CarItem
    formData: any
    handleInputChange: (field: string, value: string) => void
    setPreview: (preview: BookingPreviewDTO | null) => void
    prevStep: () => void
    nextStep: () => void
}

// Danh sách địa điểm tại Hà Nội
const rentalLocations = [
    { value: "noibai", label: "Sân bay Nội Bài" },
    { value: "hoankiem", label: "Quận Hoàn Kiếm" },
    { value: "dongda", label: "Quận Đống Đa" },
    { value: "caugiay", label: "Quận Cầu Giấy" },
    { value: "hadong", label: "Quận Hà Đông" },
    { value: "bacninh", label: "Bắc Ninh" },
]

export default function Step2RentalInfo({
                                            selectedCar,
                                            formData,
                                            handleInputChange,
                                            setPreview,
                                            prevStep,
                                            nextStep,
                                        }: Step2RentalInfoProps) {
    const [loading, setLoading] = useState(false)
    const [preview, setLocalPreview] = useState<BookingPreviewDTO | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    // ✅ availability state
    const [checkingAvail, setCheckingAvail] = useState(false)
    const [availableUnits, setAvailableUnits] = useState<number | null>(null)
    const [canProceed, setCanProceed] = useState(true)
    const [busySlots, setBusySlots] = useState<BusySlotDTO[]>([])
    const lastWarnRef = useRef<string>("")

    const fmtDT = (iso: string) => {
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return iso
        return d.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    // Validate logic
    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        const now = new Date()

        const pickup =
            formData.pickupDate && formData.pickupTime
                ? new Date(`${formData.pickupDate}T${formData.pickupTime}`)
                : null
        const dropoff =
            formData.returnDate && formData.returnTime
                ? new Date(`${formData.returnDate}T${formData.returnTime}`)
                : null

        if (!formData.pickupLocation) newErrors.pickupLocation = "Chọn địa điểm nhận xe"
        if (!formData.returnLocation) newErrors.returnLocation = "Chọn địa điểm trả xe"
        if (!formData.pickupDate) newErrors.pickupDate = "Chọn ngày nhận xe"
        if (!formData.returnDate) newErrors.returnDate = "Chọn ngày trả xe"
        if (!formData.pickupTime) newErrors.pickupTime = "Chọn giờ nhận xe"
        if (!formData.returnTime) newErrors.returnTime = "Chọn giờ trả xe"

        if (pickup && pickup < now) {
            newErrors.pickupDate = "Ngày giờ nhận xe không được ở quá khứ"
        }
        if (pickup && dropoff && dropoff <= pickup) {
            newErrors.returnDate = "Ngày giờ trả phải sau ngày nhận"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const isValid = Object.keys(errors).length === 0

    // ✅ (1) Preview booking khi form hợp lệ
    useEffect(() => {
        if (validateForm()) {
            const dto: BookingRequestDTO = {
                carId: selectedCar.carId,
                pickupLocation: formData.pickupLocation,
                returnLocation: formData.returnLocation,
                pickupDate: formData.pickupDate,
                returnDate: formData.returnDate,
                pickupTime: formData.pickupTime,
                returnTime: formData.returnTime,
                notes: "",
                fullName: "",
                email: "",
                phone: "",
                address: "",
                idNumber: "",
                licenseNumber: "",
            }

            setLoading(true)
            bookingApi
                .previewBooking(dto)
                .then((res) => {
                    setLocalPreview(res)
                    setPreview(res)
                })
                .catch(() => {
                    setLocalPreview(null)
                    setPreview(null)
                })
                .finally(() => setLoading(false))
        } else {
            setLocalPreview(null)
            setPreview(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, selectedCar.carId])

    // ✅ (2) Check availability: CHỈ theo ngày/giờ thuê
    useEffect(() => {
        const { pickupDate, pickupTime, returnDate, returnTime } = formData

        // chỉ check khi đủ 4 field
        if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
            setCanProceed(true)
            setAvailableUnits(null)
            setBusySlots([])
            setCheckingAvail(false)
            lastWarnRef.current = ""
            return
        }

        // ✅ gửi dạng có giây để BE parse LocalDateTime chắc chắn
        const startDT = `${pickupDate}T${pickupTime}:00`
        const endDT = `${returnDate}T${returnTime}:00`

        // validate nhanh: end phải > start
        if (new Date(startDT).getTime() >= new Date(endDT).getTime()) {
            setCanProceed(false)
            setAvailableUnits(0)
            setBusySlots([])
            const msg = "Ngày giờ trả phải sau ngày nhận"
            if (lastWarnRef.current !== msg) {
                toast.warning(msg)
                lastWarnRef.current = msg
            }
            return
        }

        const timer = setTimeout(async () => {
            try {
                setCheckingAvail(true)

                const rs = (await bookingApi.checkAvailability(
                    selectedCar.carId,
                    startDT,
                    endDT
                )) as AvailabilityDTO

                setAvailableUnits(rs.availableUnits)
                setCanProceed(rs.available)
                setBusySlots(rs.busySlots || [])

                if (!rs.available) {
                    // toast + top 3 slot bận
                    const top = (rs.busySlots || []).slice(0, 3)
                    const ranges = top
                        .map((s) => `${fmtDT(s.startDT)} → ${fmtDT(s.endDT)}`)
                        .join(" | ")

                    const msg = ranges
                        ? `${rs.message} | Bận: ${ranges}${
                            (rs.busySlots?.length || 0) > 3 ? " ..." : ""
                        }`
                        : rs.message

                    if (lastWarnRef.current !== msg) {
                        toast.warning(msg)
                        lastWarnRef.current = msg
                    }
                } else {
                    lastWarnRef.current = ""
                }
            } catch (e: any) {
                setCanProceed(false)
                setAvailableUnits(0)
                setBusySlots([])
                const msg = e?.response?.data?.message || "Không kiểm tra được tình trạng xe"
                if (lastWarnRef.current !== msg) {
                    toast.error(msg)
                    lastWarnRef.current = msg
                }
            } finally {
                setCheckingAvail(false)
            }
        }, 400) // debounce

        return () => clearTimeout(timer)
    }, [
        formData.pickupDate,
        formData.pickupTime,
        formData.returnDate,
        formData.returnTime,
        selectedCar.carId,
    ])

    // Helper class cho field lỗi
    const inputClass = (field: string) =>
        `border ${
            errors[field] && touched[field]
                ? "border-red-500 focus:ring-red-500"
                : "border-sky-200"
        }`

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }))
        validateForm()
    }

    const busyTitle = useMemo(() => {
        if (checkingAvail) return "Đang kiểm tra..."
        if (availableUnits === null) return "—"
        return `${availableUnits} xe`
    }, [checkingAvail, availableUnits])

    return (
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
            {/* LEFT: Form */}
            <div className="lg:col-span-2">
                <Card className="border-sky-100 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-gray-800">
                            <Car className="h-6 w-6 mr-2 text-sky-500" />
                            Thông Tin Thuê Xe
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Car info */}
                        <div className="bg-sky-50 p-4 rounded-lg border border-sky-200 flex items-center gap-4">
                            <Image
                                src={`${selectedCar.imageUrl}`}
                                alt={selectedCar.carName}
                                width={120}
                                height={80}
                                className="w-24 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{selectedCar.carName}</h4>
                                <p className="text-sky-600 font-medium">
                                    {selectedCar.price.toLocaleString("vi-VN")}đ/ngày
                                </p>

                                {/* ✅ hiển thị số lượng khả dụng theo thời gian thuê */}
                                <p className="text-sm text-gray-600 mt-1">
                                    Khả dụng theo lịch: <b>{busyTitle}</b>
                                </p>

                                {!canProceed && availableUnits !== null && (
                                    <p className="text-sm text-red-600 mt-1">
                                        Không khả dụng trong thời gian đã chọn.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Locations */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Địa điểm nhận xe *</Label>
                                <Select
                                    value={formData.pickupLocation}
                                    onValueChange={(value) => handleInputChange("pickupLocation", value)}
                                >
                                    <SelectTrigger
                                        className={inputClass("pickupLocation")}
                                        onBlur={() => handleBlur("pickupLocation")}
                                    >
                                        <SelectValue placeholder="Chọn địa điểm nhận" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rentalLocations.map((loc) => (
                                            <SelectItem key={loc.value} value={loc.value}>
                                                {loc.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {touched.pickupLocation && errors.pickupLocation && (
                                    <p className="text-red-500 text-sm">{errors.pickupLocation}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Địa điểm trả xe *</Label>
                                <Select
                                    value={formData.returnLocation}
                                    onValueChange={(value) => handleInputChange("returnLocation", value)}
                                >
                                    <SelectTrigger
                                        className={inputClass("returnLocation")}
                                        onBlur={() => handleBlur("returnLocation")}
                                    >
                                        <SelectValue placeholder="Chọn địa điểm trả" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rentalLocations.map((loc) => (
                                            <SelectItem key={loc.value} value={loc.value}>
                                                {loc.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {touched.returnLocation && errors.returnLocation && (
                                    <p className="text-red-500 text-sm">{errors.returnLocation}</p>
                                )}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Ngày nhận *</Label>
                                <Input
                                    type="date"
                                    value={formData.pickupDate}
                                    onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                                    onBlur={() => handleBlur("pickupDate")}
                                    className={inputClass("pickupDate")}
                                />
                                {touched.pickupDate && errors.pickupDate && (
                                    <p className="text-red-500 text-sm">{errors.pickupDate}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Ngày trả *</Label>
                                <Input
                                    type="date"
                                    value={formData.returnDate}
                                    onChange={(e) => handleInputChange("returnDate", e.target.value)}
                                    onBlur={() => handleBlur("returnDate")}
                                    className={inputClass("returnDate")}
                                />
                                {touched.returnDate && errors.returnDate && (
                                    <p className="text-red-500 text-sm">{errors.returnDate}</p>
                                )}
                            </div>
                        </div>

                        {/* Times */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Giờ nhận *</Label>
                                <Input
                                    type="time"
                                    value={formData.pickupTime}
                                    onChange={(e) => handleInputChange("pickupTime", e.target.value)}
                                    onBlur={() => handleBlur("pickupTime")}
                                    className={inputClass("pickupTime")}
                                />
                                {touched.pickupTime && errors.pickupTime && (
                                    <p className="text-red-500 text-sm">{errors.pickupTime}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Giờ trả *</Label>
                                <Input
                                    type="time"
                                    value={formData.returnTime}
                                    onChange={(e) => handleInputChange("returnTime", e.target.value)}
                                    onBlur={() => handleBlur("returnTime")}
                                    className={inputClass("returnTime")}
                                />
                                {touched.returnTime && errors.returnTime && (
                                    <p className="text-red-500 text-sm">{errors.returnTime}</p>
                                )}
                            </div>
                        </div>

                        {/* ✅ hiển thị khung giờ không khả dụng ngay dưới form */}
                        {!canProceed && busySlots.length > 0 && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                <p className="font-semibold text-red-700">Khung giờ không khả dụng</p>
                                <ul className="mt-2 space-y-1 text-sm text-red-700">
                                    {busySlots.slice(0, 6).map((s, idx) => (
                                        <li key={idx}>
                                            • {fmtDT(s.startDT)} → {fmtDT(s.endDT)} ({s.status})
                                        </li>
                                    ))}
                                    {busySlots.length > 6 && (
                                        <li className="text-red-600">
                                            … và {busySlots.length - 6} khung giờ khác
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT: Summary */}
            <div>
                <Card className="border-sky-100 shadow-lg sticky top-24">
                    <CardHeader>
                        <CardTitle className="text-gray-800">Chi Tiết Giá</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Image
                            src={`${selectedCar.imageUrl}`}
                            alt={selectedCar.carName}
                            width={120}
                            height={80}
                            className="w-24 h-16 object-cover rounded"
                        />

                        {loading && <p className="text-gray-500">Đang tính toán...</p>}
                        {!loading && preview && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số ngày thuê:</span>
                                    <span className="font-medium">{preview.rentalDays} ngày</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giá/ngày:</span>
                                    <span className="font-medium">
                    {selectedCar.price.toLocaleString("vi-VN")}đ
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tổng cộng:</span>
                                    <span className="text-sky-600 font-bold">
                    {preview.totalAmount.toLocaleString("vi-VN")}đ
                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tiền cọc (30%):</span>
                                    <span className="text-sky-600 font-semibold">
                    {preview.depositAmount.toLocaleString("vi-VN")}đ
                  </span>
                                </div>
                            </>
                        )}

                        <div className="flex justify-between gap-2 pt-4">
                            <Button onClick={prevStep} variant="outline" className="border-sky-200">
                                <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                            </Button>

                            <Button
                                onClick={nextStep}
                                disabled={!isValid || !preview || !canProceed}
                                className="bg-sky-500 hover:bg-sky-600 text-white"
                                title={!canProceed ? "Xe không khả dụng trong thời gian này" : undefined}
                            >
                                Tiếp theo <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>

                        {!canProceed && (
                            <p className="text-sm text-red-600">
                                Xe không khả dụng trong thời gian đã chọn. Vui lòng đổi ngày/giờ.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
