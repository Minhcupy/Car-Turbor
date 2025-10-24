"use client"

import { useState } from "react"
import Image from "next/image"
import { User, ArrowLeft, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CarItem, BookingPreviewDTO } from "@/src/services/user/apiBookingUserService "

interface Step3PersonalInfoProps {
    selectedCar: CarItem
    formData: {
        fullName: string
        email: string
        phone: string
        address: string
        idNumber: string
        licenseNumber: string
        notes: string
    }
    handleInputChange: (field: string, value: string) => void
    preview: BookingPreviewDTO | null
    prevStep: () => void
    nextStep: () => void
}

export default function Step3PersonalInfo({
    selectedCar,
    formData,
    handleInputChange,
    preview,
    prevStep,
    nextStep,
}: Step3PersonalInfoProps) {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    // Validate từng field
    const validateField = (field: string, value: string) => {
        switch (field) {
            case "fullName":
                if (!value.trim()) return "Họ tên không được để trống"
                if (!/^[\p{L}\s]+$/u.test(value)) return "Họ tên chỉ chứa chữ cái"
                break
            case "email":
                if (!value.trim()) return "Email không được để trống"
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email không hợp lệ"
                break
            case "phone":
                if (!value.trim()) return "Số điện thoại không được để trống"
                if (!/^\d{9,11}$/.test(value)) return "Số điện thoại phải từ 9-11 số"
                break
            case "address":
                if (!value.trim()) return "Địa chỉ không được để trống"
                break
            case "idNumber":
                if (!value.trim()) return "CCCD/CMND không được để trống"
                if (!/^\d{9,12}$/.test(value)) return "CCCD/CMND phải 9 hoặc 12 số"
                break
            case "licenseNumber":
                if (!value.trim()) return "Số GPLX không được để trống"
                break
            default:
                return ""
        }
        return ""
    }

    // Validate toàn bộ form
    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        for (const key in formData) {
            if (key !== "notes") {
                const err = validateField(key, (formData as any)[key])
                if (err) newErrors[key] = err
            }
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }))
        const err = validateField(field, (formData as any)[field])
        setErrors((prev) => ({ ...prev, [field]: err }))
    }

    const handleNext = () => {
        const allTouched: Record<string, boolean> = {}
        Object.keys(formData).forEach((k) => {
            if (k !== "notes") allTouched[k] = true
        })
        setTouched(allTouched)
        if (validateForm()) {
            nextStep()
        }
    }

    const inputClass = (field: string) =>
        `border ${errors[field] && touched[field] ? "border-red-500 focus:ring-red-500" : "border-sky-200"}`

    return (
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
            {/* LEFT: Form nhập thông tin cá nhân */}
            <div className="lg:col-span-2">
                <Card className="border-sky-100 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-gray-800">
                            <User className="h-6 w-6 mr-2 text-sky-500" />
                            Thông Tin Cá Nhân
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Họ tên + SĐT */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Họ và tên *</Label>
                                <Input
                                    placeholder="Nhập họ tên đầy đủ"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                                    onBlur={() => handleBlur("fullName")}
                                    className={inputClass("fullName")}
                                />
                                {touched.fullName && errors.fullName && (
                                    <p className="text-red-500 text-sm">{errors.fullName}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Số điện thoại *</Label>
                                <Input
                                    type="tel"
                                    placeholder="0123 456 789"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    onBlur={() => handleBlur("phone")}
                                    className={inputClass("phone")}
                                />
                                {touched.phone && errors.phone && (
                                    <p className="text-red-500 text-sm">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input
                                type="email"
                                placeholder="example@email.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                onBlur={() => handleBlur("email")}
                                className={inputClass("email")}
                            />
                            {touched.email && errors.email && (
                                <p className="text-red-500 text-sm">{errors.email}</p>
                            )}
                        </div>

                        {/* Địa chỉ */}
                        <div className="space-y-2">
                            <Label>Địa chỉ *</Label>
                            <Input
                                placeholder="Nhập địa chỉ"
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                onBlur={() => handleBlur("address")}
                                className={inputClass("address")}
                            />
                            {touched.address && errors.address && (
                                <p className="text-red-500 text-sm">{errors.address}</p>
                            )}
                        </div>

                        {/* CCCD + GPLX */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Số CCCD/CMND *</Label>
                                <Input
                                    placeholder="123456789012"
                                    value={formData.idNumber}
                                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                                    onBlur={() => handleBlur("idNumber")}
                                    className={inputClass("idNumber")}
                                />
                                {touched.idNumber && errors.idNumber && (
                                    <p className="text-red-500 text-sm">{errors.idNumber}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Số GPLX *</Label>
                                <Input
                                    placeholder="Nhập số GPLX"
                                    value={formData.licenseNumber}
                                    onChange={(e) =>
                                        handleInputChange("licenseNumber", e.target.value)
                                    }
                                    onBlur={() => handleBlur("licenseNumber")}
                                    className={inputClass("licenseNumber")}
                                />
                                {touched.licenseNumber && errors.licenseNumber && (
                                    <p className="text-red-500 text-sm">{errors.licenseNumber}</p>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label>Ghi chú</Label>
                            <Textarea
                                placeholder="Yêu cầu đặc biệt hoặc ghi chú thêm..."
                                value={formData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                className="border-sky-200"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT: Summary */}
            <div>
                <Card className="border-sky-100 shadow-lg sticky top-24">
                    <CardHeader>
                        <CardTitle className="text-gray-800">Tóm Tắt Đơn Thuê</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Image
                            src={`http://localhost:8080${selectedCar.imageUrl}`}
                            alt={selectedCar.carName}
                            width={120}
                            height={80}
                            className="w-24 h-16 object-cover rounded"
                        />

                        <div>
                            <h4 className="font-semibold">{selectedCar.carName}</h4>
                            <p className="text-sm text-gray-600">
                                {preview?.rentalDays} ngày thuê
                            </p>
                            <p className="text-lg font-bold text-sky-600">
                                {preview?.totalAmount?.toLocaleString("vi-VN")}đ
                            </p>
                        </div>

                        <div className="flex justify-between gap-2">
                            <Button
                                onClick={prevStep}
                                variant="outline"
                                className="border-sky-200 text-sky-600 hover:bg-sky-50"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                            </Button>
                            <Button
                                onClick={handleNext}
                                className="bg-sky-500 hover:bg-sky-600 text-white"
                            >
                                Tiếp theo <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
