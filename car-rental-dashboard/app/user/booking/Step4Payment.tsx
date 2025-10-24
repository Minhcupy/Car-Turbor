"use client"
import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Download, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"

import {
    bookingApi,
    BookingRequestDTO,
    BookingPreviewDTO,
    BookingResponseDTO,
    CarItem,
} from "@/src/services/user/apiBookingUserService "
import { paymentApi, PaymentResponseDTO } from "@/src/services/user/paymentApi"

// Map enum -> nhãn hiển thị
const paymentMethods = [
    { key: "SIMULATED", label: "Thanh toán giả lập (Test)" },
    { key: "CASH", label: "Tiền mặt" },
    { key: "MOMO", label: "Ví MoMo" },
    { key: "VNPAY", label: "VNPay" },
    { key: "CREDIT_CARD", label: "Thẻ tín dụng" },
]

interface Step4PaymentProps {
    selectedCar: CarItem
    formData: any
    preview: BookingPreviewDTO | null
    prevStep: () => void
}

export default function Step4Payment({
    selectedCar,
    formData,
    preview,
    prevStep,
}: Step4PaymentProps) {
    const [loading, setLoading] = useState(false)
    const [booking, setBooking] = useState<BookingResponseDTO | null>(null)
    const [payment, setPayment] = useState<PaymentResponseDTO | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<string>("SIMULATED") // mặc định giả lập
    const [agree, setAgree] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const handlePayment = async () => {
        if (!preview) return
        setLoading(true)
        setErrorMsg(null)

        try {
            // 1. Tạo booking
            const dto: BookingRequestDTO = {
                carId: selectedCar.carId,
                pickupLocation: formData.pickupLocation || "",
                returnLocation: formData.returnLocation || "",
                pickupDate: formData.pickupDate,
                returnDate: formData.returnDate,
                pickupTime: formData.pickupTime || "08:00",
                returnTime: formData.returnTime || "18:00",
                notes: formData.notes || "",
                fullName: formData.fullName,
                email: formData.email || "",
                phone: formData.phone,
                address: formData.address || "",
                idNumber: formData.idNumber || "",
                licenseNumber: formData.licenseNumber || "",
            }

            const bookingRes = await bookingApi.createBooking(dto)
            setBooking(bookingRes)

            // 2. Tạo payment
            const paymentCreated = await paymentApi.createPayment(
                bookingRes.bookingId,
                {
                    payerName: formData.fullName,
                    payerEmail: formData.email,
                    payerPhone: formData.phone,
                },
                paymentMethod
            )

            if (!paymentCreated?.paymentId) {
                throw new Error("Không nhận được paymentId từ server")
            }

            // 3. Giả lập thanh toán
            const payRes = await paymentApi.simulatePay(paymentCreated.paymentId)
            setPayment(payRes)
        } catch (err: any) {
            console.error("❌ Payment error:", err)
            console.error("Response data:", err.response?.data)
            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Có lỗi xảy ra khi xử lý thanh toán."
            setErrorMsg(message)
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadQR = () => {
        if (!payment?.qrBase64) return
        const link = document.createElement("a")
        link.href = `data:image/png;base64,${payment.qrBase64}`
        link.download = `QR_Booking_${booking?.bookingId || "payment"}.png`
        link.click()
    }

    return (
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
                {/* Thông tin thanh toán */}
                <Card className="border-sky-100 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-gray-800">Thông Tin Thanh Toán</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {preview && (
                            <div className="grid md:grid-cols-3 gap-6 text-sm">
                                <div>
                                    <p className="text-gray-600">Tổng giá trị:</p>
                                    <p className="font-bold text-lg">
                                        {preview.totalAmount.toLocaleString("vi-VN")}đ
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Tiền cọc (30%):</p>
                                    <p className="font-bold text-lg text-sky-600">
                                        {preview.depositAmount.toLocaleString("vi-VN")}đ
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Thanh toán khi nhận:</p>
                                    <p className="font-medium">
                                        {(
                                            preview.totalAmount - preview.depositAmount
                                        ).toLocaleString("vi-VN")}
                                        đ
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Chọn phương thức */}
                <Card className="border-sky-100 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-gray-800">Chọn Phương Thức Thanh Toán</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-4">
                        {paymentMethods.map((m) => (
                            <Button
                                key={m.key}
                                variant="ghost"
                                onClick={() => setPaymentMethod(m.key)}
                                className={`relative flex items-center justify-center p-0 h-24 border rounded-xl overflow-hidden transition-all
                  ${paymentMethod === m.key
                                        ? "border-sky-500 shadow-md scale-105"
                                        : "border-gray-200 hover:border-sky-300 hover:shadow-sm"
                                    }`}
                            >
                                <span className="font-semibold">{m.label}</span>
                            </Button>
                        ))}
                    </CardContent>
                </Card>

                {/* Điều khoản */}
                <div className="flex items-center gap-2">
                    <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} />
                    <span className="text-sm text-gray-700">
                        Tôi đồng ý với{" "}
                        <a href="#" className="text-sky-600 underline">
                            điều khoản thuê xe
                        </a>
                    </span>
                </div>

                {/* Loading */}
                {loading && (
                    <Card className="border-sky-200 bg-sky-50">
                        <CardHeader>
                            <CardTitle className="text-sky-600">Đang xử lý thanh toán...</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-48 w-48 mx-auto rounded-lg" />
                        </CardContent>
                    </Card>
                )}

                {/* Lỗi */}
                {errorMsg && (
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <CardTitle className="text-red-700">Lỗi Thanh Toán</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-red-700">{errorMsg}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Thành công */}
                {payment && (
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="text-green-700">✅ Đặt xe thành công</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p>
                                Mã đơn: <b>{payment.bookingId}</b>
                            </p>
                            <p>
                                Khách hàng: {payment.payerName} - {payment.payerPhone}
                            </p>
                            <p>
                                Trạng thái: <b>{payment.status}</b>
                            </p>
                            {payment.qrBase64 && (
                                <div className="flex flex-col items-center mt-4">
                                    <p className="text-gray-700 mb-2">
                                        Vui lòng <b>lưu lại mã QR</b> để làm thủ tục nhận xe.
                                    </p>
                                    <img
                                        src={`data:image/png;base64,${payment.qrBase64}`}
                                        alt="QR Payment"
                                        className="w-48 h-48 border rounded-lg shadow"
                                    />
                                    <Button
                                        onClick={handleDownloadQR}
                                        className="mt-4 flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white"
                                    >
                                        <Download className="h-4 w-4" /> Tải xuống QR
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Nút hành động */}
                {!payment && !loading && (
                    <div className="flex justify-between pt-4">
                        <Button onClick={prevStep} variant="outline" className="border-sky-200">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                        </Button>
                        <Button
                            onClick={handlePayment}
                            disabled={!agree}
                            className="bg-sky-500 hover:bg-sky-600 text-white"
                        >
                            Thanh toán ({paymentMethod})
                        </Button>
                    </div>
                )}
            </div>

            {/* RIGHT: Tóm tắt đơn */}
            <div>
                <Card className="border-sky-100 shadow-lg sticky top-24">
                    <CardHeader>
                        <CardTitle className="text-gray-800">Tóm Tắt Đơn Hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex gap-3">
                            <Image
                                src={`http://localhost:8080${selectedCar.imageUrl}`}
                                alt={selectedCar.carName}
                                width={100}
                                height={70}
                                className="rounded object-cover"
                            />
                            <div>
                                <h4 className="font-semibold">{selectedCar.carName}</h4>
                                <p className="text-gray-600">{preview?.rentalDays} ngày</p>
                            </div>
                        </div>
                        <div className="divide-y">
                            <div className="flex justify-between py-1">
                                <span>Khách hàng:</span>
                                <span>{formData.fullName}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Điện thoại:</span>
                                <span>{formData.phone}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Ngày nhận:</span>
                                <span>{formData.pickupDate}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Ngày trả:</span>
                                <span>{formData.returnDate}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
