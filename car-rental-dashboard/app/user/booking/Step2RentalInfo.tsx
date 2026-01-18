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
} from "@/src/services/user/apiBookingUserService "

import type { Pricing } from "@/src/services/user/pricingApi"

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
    selectedPricingId: number | null
    selectedPricing: Pricing | null

    formData: any
    handleInputChange: (field: string, value: string) => void
    setPreview: (preview: BookingPreviewDTO | null) => void
    prevStep: () => void
    nextStep: () => void
}

const rentalLocations = [
    { value: "noibai", label: "Sân bay Nội Bài" },
    { value: "hoankiem", label: "Quận Hoàn Kiếm" },
    { value: "dongda", label: "Quận Đống Đa" },
    { value: "caugiay", label: "Quận Cầu Giấy" },
    { value: "hadong", label: "Quận Hà Đông" },
    { value: "bacninh", label: "Bắc Ninh" },
]

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
            return "ngày"
    }
}

function toMoney(n: number) {
    return (n ?? 0).toLocaleString("vi-VN")
}

// yyyy-mm-dd
function fmtDateInput(d: Date) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

// HH:mm
function fmtTimeInput(d: Date) {
    const hh = String(d.getHours()).padStart(2, "0")
    const mi = String(d.getMinutes()).padStart(2, "0")
    return `${hh}:${mi}`
}

export default function Step2RentalInfo({
                                            selectedCar,
                                            selectedPricingId,
                                            selectedPricing,
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

    // ✅ số lượng thuê theo đơn vị (giờ/ngày/tuần/tháng)
    const [rentQty, setRentQty] = useState<string>(() => String(formData?.rentalUnits ?? 1))

    // availability
    const [checkingAvail, setCheckingAvail] = useState(false)
    const [availableUnits, setAvailableUnits] = useState<number | null>(null)
    const [canProceed, setCanProceed] = useState(true)
    const [busySlots, setBusySlots] = useState<BusySlotDTO[]>([])
    const lastWarnRef = useRef<string>("")

    const displayUnit = unitLabel(selectedPricing?.unit)
    const displayPrice = selectedPricing?.price ?? selectedCar.price ?? 0

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

    // ✅ rentalUnits lấy trực tiếp từ rentQty
    const rentalUnits = useMemo(() => {
        const n = Number(rentQty)
        if (!Number.isFinite(n) || n <= 0) return null
        return Math.floor(n)
    }, [rentQty])

    // ✅ luôn sync rentalUnits vào formData để Step4 gửi BE đúng
    useEffect(() => {
        if (!rentalUnits) return
        // tránh set lại nếu không đổi
        if (String(formData?.rentalUnits ?? "") !== String(rentalUnits)) {
            handleInputChange("rentalUnits", String(rentalUnits))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rentalUnits])

    // ✅ Auto set returnDate/returnTime theo unit + rentalUnits
    useEffect(() => {
        if (!selectedPricing?.unit) return
        if (!formData.pickupDate || !formData.pickupTime) return
        if (!rentalUnits) return

        const start = new Date(`${formData.pickupDate}T${formData.pickupTime}:00`)
        if (Number.isNaN(start.getTime())) return

        const end = new Date(start)

        switch (selectedPricing.unit) {
            case "HOUR":
                end.setHours(end.getHours() + rentalUnits)
                break
            case "DAY":
                end.setDate(end.getDate() + rentalUnits)
                break
            case "WEEK":
                end.setDate(end.getDate() + rentalUnits * 7)
                break
            case "MONTH":
                end.setMonth(end.getMonth() + rentalUnits)
                break
            default:
                end.setDate(end.getDate() + rentalUnits)
        }

        const nextReturnDate = fmtDateInput(end)
        const nextReturnTime = fmtTimeInput(end)

        // ✅ CHỐNG LOOP: chỉ set nếu khác hiện tại
        if (formData.returnDate !== nextReturnDate) {
            handleInputChange("returnDate", nextReturnDate)
        }
        if (formData.returnTime !== nextReturnTime) {
            handleInputChange("returnTime", nextReturnTime)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPricing?.unit, formData.pickupDate, formData.pickupTime, rentalUnits])

    // ✅ số ngày theo lịch (để hiển thị)
    const rentalDaysFromDates = useMemo(() => {
        const { pickupDate, pickupTime, returnDate, returnTime } = formData
        if (!pickupDate || !pickupTime || !returnDate || !returnTime) return null
        const start = new Date(`${pickupDate}T${pickupTime}:00`).getTime()
        const end = new Date(`${returnDate}T${returnTime}:00`).getTime()
        if (end <= start) return null
        const diffMs = end - start
        const day = 24 * 3600_000
        return Math.ceil(diffMs / day)
    }, [formData.pickupDate, formData.pickupTime, formData.returnDate, formData.returnTime])

    // ✅ tính tiền theo kiểu thuê đang chọn
    const priceCalc = useMemo(() => {
        if (!selectedPricingId || !selectedPricing) return null
        if (!rentalUnits) return null

        const total = rentalUnits * (selectedPricing.price ?? 0)
        const deposit = Math.round(total * 0.3)

        return {
            units: rentalUnits,
            unitText: unitLabel(selectedPricing.unit),
            pricePerUnit: selectedPricing.price ?? 0,
            total,
            deposit,
        }
    }, [selectedPricingId, selectedPricing, rentalUnits])

    // validate
    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        const now = new Date()

        const pickup =
            formData.pickupDate && formData.pickupTime
                ? new Date(`${formData.pickupDate}T${formData.pickupTime}`)
                : null

        if (!formData.pickupLocation) newErrors.pickupLocation = "Chọn địa điểm nhận xe"
        if (!formData.returnLocation) newErrors.returnLocation = "Chọn địa điểm trả xe"
        if (!formData.pickupDate) newErrors.pickupDate = "Chọn ngày nhận xe"
        if (!formData.pickupTime) newErrors.pickupTime = "Chọn giờ nhận xe"

        if (!rentalUnits) newErrors.rentQty = "Nhập số lượng thuê hợp lệ"
        if (!selectedPricingId) newErrors.pricingId = "Chưa chọn kiểu thuê"

        if (pickup && pickup < now) newErrors.pickupDate = "Ngày giờ nhận xe không được ở quá khứ"

        // returnDate/returnTime auto
        if (!formData.returnDate || !formData.returnTime) newErrors.returnDate = "Chưa tính được ngày/giờ trả"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const isValid = Object.keys(errors).length === 0

    // ✅ Preview booking: gửi pricingId + rentalUnits
    useEffect(() => {
        if (!selectedPricingId) {
            setLocalPreview(null)
            setPreview(null)
            return
        }

        if (!validateForm()) {
            setLocalPreview(null)
            setPreview(null)
            return
        }

        const dto: BookingRequestDTO = {
            carId: selectedCar.carId,
            pricingId: selectedPricingId,
            rentalUnits: rentalUnits ?? 1,

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
        } as any

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedCar.carId,
        selectedPricingId,
        rentalUnits,
        formData.pickupLocation,
        formData.returnLocation,
        formData.pickupDate,
        formData.pickupTime,
        formData.returnDate,
        formData.returnTime,
    ])

    // availability (dùng startDT/endDT đã auto)
    useEffect(() => {
        const { pickupDate, pickupTime, returnDate, returnTime } = formData

        if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
            setCanProceed(true)
            setAvailableUnits(null)
            setBusySlots([])
            setCheckingAvail(false)
            lastWarnRef.current = ""
            return
        }

        const startDT = `${pickupDate}T${pickupTime}:00`
        const endDT = `${returnDate}T${returnTime}:00`

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
                const rs = (await bookingApi.checkAvailability(selectedCar.carId, startDT, endDT)) as AvailabilityDTO

                setAvailableUnits(rs.availableUnits)
                setCanProceed(rs.available)
                setBusySlots(rs.busySlots || [])

                if (!rs.available) {
                    const top = (rs.busySlots || []).slice(0, 3)
                    const ranges = top.map((s) => `${fmtDT(s.startDT)} → ${fmtDT(s.endDT)}`).join(" | ")

                    const msg = ranges
                        ? `${rs.message} | Bận: ${ranges}${(rs.busySlots?.length || 0) > 3 ? " ..." : ""}`
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
        }, 400)

        return () => clearTimeout(timer)
    }, [
        formData.pickupDate,
        formData.pickupTime,
        formData.returnDate,
        formData.returnTime,
        selectedCar.carId,
    ])

    const inputClass = (field: string) =>
        `border ${errors[field] && touched[field] ? "border-red-500 focus:ring-red-500" : "border-sky-200"}`

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
            {/* LEFT */}
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
                                    {toMoney(displayPrice)}đ/{displayUnit}
                                </p>

                                {!selectedPricingId && (
                                    <p className="text-sm text-red-600 mt-1">
                                        Chưa có kiểu thuê. Quay lại bước 1 để chọn.
                                    </p>
                                )}

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
                                    <SelectTrigger className={inputClass("pickupLocation")} onBlur={() => handleBlur("pickupLocation")}>
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
                                    <SelectTrigger className={inputClass("returnLocation")} onBlur={() => handleBlur("returnLocation")}>
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

                        {/* Pickup date/time + Qty */}
                        <div className="grid md:grid-cols-3 gap-6">
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
                                <Label>Số {unitLabel(selectedPricing?.unit)} thuê *</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={rentQty}
                                    onChange={(e) => setRentQty(e.target.value)}
                                    onBlur={() => handleBlur("rentQty")}
                                    className={inputClass("rentQty")}
                                />
                                {touched.rentQty && errors.rentQty && (
                                    <p className="text-red-500 text-sm">{errors.rentQty}</p>
                                )}
                            </div>
                        </div>

                        {/* Return date/time auto */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Ngày trả (tự tính)</Label>
                                <Input type="date" value={formData.returnDate || ""} disabled className="border-sky-200" />
                                {errors.returnDate && <p className="text-red-500 text-sm">{errors.returnDate}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Giờ trả (tự tính)</Label>
                                <Input type="time" value={formData.returnTime || ""} disabled className="border-sky-200" />
                            </div>
                        </div>

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
                                        <li className="text-red-600">… và {busySlots.length - 6} khung giờ khác</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT */}
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

                        {!loading && selectedPricingId && priceCalc && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Theo lịch:</span>
                                    <span className="font-medium">{rentalDaysFromDates ?? "—"} ngày</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tính tiền:</span>
                                    <span className="font-medium">
                    {priceCalc.units} {priceCalc.unitText}
                  </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giá/{priceCalc.unitText}:</span>
                                    <span className="font-medium">{toMoney(priceCalc.pricePerUnit)}đ</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tổng cộng:</span>
                                    <span className="text-sky-600 font-bold">{toMoney(priceCalc.total)}đ</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tiền cọc (30%):</span>
                                    <span className="text-sky-600 font-semibold">{toMoney(priceCalc.deposit)}đ</span>
                                </div>
                            </>
                        )}

                        {!loading && (!selectedPricingId || !priceCalc) && preview && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số ngày thuê:</span>
                                    <span className="font-medium">{preview.rentalDays} ngày</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tổng cộng:</span>
                                    <span className="text-sky-600 font-bold">{toMoney(preview.totalAmount)}đ</span>
                                </div>
                            </>
                        )}

                        <div className="flex justify-between gap-2 pt-4">
                            <Button onClick={prevStep} variant="outline" className="border-sky-200">
                                <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                            </Button>

                            <Button
                                onClick={nextStep}
                                disabled={!isValid || !canProceed || !selectedPricingId || !priceCalc}
                                className="bg-sky-500 hover:bg-sky-600 text-white"
                                title={!canProceed ? "Xe không khả dụng trong thời gian này" : undefined}
                            >
                                Tiếp theo <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>

                        {!selectedPricingId && (
                            <p className="text-sm text-red-600">
                                Chưa có kiểu thuê. Vui lòng quay lại bước 1 để chọn kiểu thuê.
                            </p>
                        )}

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
