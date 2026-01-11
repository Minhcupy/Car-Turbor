"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
    Heart,
    Search,
    MapPin,
    Users,
    Fuel,
    Calendar,
    Star,
    BadgeCheck,
    AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// ✅ SỬA ĐÚNG IMPORT THEO PROJECT CỦA BẠN
import { getAllCars, type CarUserDTO } from "@/src/services/user/carApi"

function statusUI(status: CarUserDTO["status"]) {
    switch (status) {
        case "AVAILABLE":
            return { label: "Sẵn sàng", cls: "bg-emerald-50 text-emerald-700 border-emerald-100" }
        case "RENTED":
            return { label: "Đang thuê", cls: "bg-amber-50 text-amber-700 border-amber-100" }
        case "MAINTENANCE":
            return { label: "Bảo dưỡng", cls: "bg-rose-50 text-rose-700 border-rose-100" }
        default:
            return { label: status, cls: "bg-gray-50 text-gray-700 border-gray-100" }
    }
}

// ảnh có thể là url đầy đủ hoặc path tương đối
function toImg(src?: string) {
    if (!src) return "/car-placeholder.jpg"
    if (src.startsWith("http://") || src.startsWith("https://")) return src

    // nếu backend trả về path kiểu "uploads/..", prefix lại base
    const base = (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8080").replace(/\/api$/, "")
    return `${base}/${src.replace(/^\/+/, "")}`
}

export default function LeCuoiPage() {
    const features = ["Xe hoa trang trí", "Tài xế chuyên nghiệp", "Phục vụ cả ngày", "Giá cả hợp lý"]

    const [cars, setCars] = useState<CarUserDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState("")
    const [keyword, setKeyword] = useState("")
    const [onlyAvailable, setOnlyAvailable] = useState(true)

    useEffect(() => {
        let alive = true
        setLoading(true)
        setErr("")

        getAllCars()
            .then((data) => {
                if (!alive) return
                setCars(Array.isArray(data) ? data : [])
            })
            .catch((e) => {
                if (!alive) return
                setErr(e?.message || "Không thể tải danh sách xe.")
            })
            .finally(() => {
                if (!alive) return
                setLoading(false)
            })

        return () => {
            alive = false
        }
    }, [])

    const filteredCars = useMemo(() => {
        const kw = keyword.trim().toLowerCase()

        return cars
            .filter((c) => (onlyAvailable ? c.status === "AVAILABLE" : true))
            .filter((c) => {
                if (!kw) return true
                return (
                    c.carName?.toLowerCase().includes(kw) ||
                    c.brandName?.toLowerCase().includes(kw) ||
                    c.typeName?.toLowerCase().includes(kw) ||
                    c.location?.toLowerCase().includes(kw)
                )
            })
            // gợi ý: ưu tiên featured/rating cao lên đầu
            .sort((a, b) => Number(b.featured) - Number(a.featured) || (b.rating ?? 0) - (a.rating ?? 0))
    }, [cars, keyword, onlyAvailable])

    return (
        <div className="min-h-screen bg-white">
            {/* HERO */}
            <section
                className="relative py-16 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/car-service-hero-background.jpg')",
                    backgroundColor: "#0c4a6e",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-950/90 via-sky-900/80 to-sky-700/70" />
                <div className="relative z-10 container mx-auto px-4">
                    <Link href="/user/services" className="inline-flex items-center text-sky-100/90 hover:text-white">
                        ← Quay lại Dịch vụ
                    </Link>

                    <div className="mt-8 flex items-start gap-4">
                        <div className="bg-white/10 backdrop-blur w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10">
                            <Heart className="h-7 w-7 text-white" />
                        </div>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Dịch vụ xe cưới</h1>
                            <p className="mt-2 text-sky-100/90 leading-relaxed">
                                Xe cưới sang trọng, lịch sự, phù hợp trang trí theo concept.
                                {/*<span className="font-semibold"></span>*/}
                            </p>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Link href="/user/contact">
                                    <Button className="bg-white text-sky-700 hover:bg-gray-100">Liên hệ tư vấn</Button>
                                </Link>
                                <Link href="/user/cars">
                                    <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                                        Xem toàn bộ xe
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {features.map((t, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3"
                            >
                                <BadgeCheck className="h-5 w-5 text-white" />
                                <div>
                                    <p className="text-white font-semibold">{t}</p>
                                    <p className="text-sky-100/80 text-sm">Phù hợp cho ngày trọng đại</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-14 bg-sky-50">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* LEFT */}
                        <div className="lg:col-span-4">
                            <Card className="border-sky-100">
                                <CardHeader>
                                    <CardTitle className="text-xl">Tìm xe phù hợp</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative">
                                        <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <Input
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            placeholder="Tên xe, hãng, loại, địa điểm..."
                                            className="pl-9"
                                        />
                                    </div>

                                    <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={onlyAvailable}
                                            onChange={(e) => setOnlyAvailable(e.target.checked)}
                                            className="accent-sky-600"
                                        />
                                        Chỉ hiển thị xe sẵn sàng (AVAILABLE)
                                    </label>

                                    <div className="mt-6 rounded-xl bg-white p-4 border border-sky-100">
                                        <p className="font-semibold text-gray-800">Gợi ý chọn xe cưới</p>
                                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                            <li>• Ưu tiên màu trắng/đen, kiểu dáng sang</li>
                                            <li>• Chọn 4–7 chỗ theo nhu cầu đoàn</li>
                                            <li>• Ưu tiên xe featured / rating cao</li>
                                        </ul>
                                    </div>

                                    <div className="mt-6 flex flex-col gap-3">
                                        <Link href="/user/contact">
                                            <Button className="w-full bg-sky-600 hover:bg-sky-700">Nhận báo giá</Button>
                                        </Link>
                                        <Link href="/user/services">
                                            <Button variant="outline" className="w-full">
                                                Xem dịch vụ khác
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT */}
                        <div className="lg:col-span-8">
                            <div className="flex items-end justify-between gap-3 mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Danh sách xe gợi ý</h2>
                                    <p className="text-gray-600 mt-1">
                                        Tổng: <span className="font-semibold">{filteredCars.length}</span> xe
                                    </p>
                                </div>
                            </div>

                            {/* States */}
                            {loading ? (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <Card key={i} className="border-sky-100 overflow-hidden">
                                            <div className="h-44 bg-white animate-pulse" />
                                            <CardContent className="p-5">
                                                <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
                                                <div className="mt-3 h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                                                <div className="mt-4 h-9 bg-slate-200 rounded animate-pulse" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : err ? (
                                <Card className="border-sky-100">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <AlertTriangle className="h-5 w-5 text-rose-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">Không thể tải dữ liệu</p>
                                                <p className="text-gray-600 mt-1 text-sm">{err}</p>
                                                <Button
                                                    className="mt-4 bg-sky-600 hover:bg-sky-700"
                                                    onClick={() => {
                                                        setLoading(true)
                                                        setErr("")
                                                        getAllCars()
                                                            .then((data) => setCars(Array.isArray(data) ? data : []))
                                                            .catch((e) => setErr(e?.message || "Không thể tải danh sách xe."))
                                                            .finally(() => setLoading(false))
                                                    }}
                                                >
                                                    Thử lại
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : filteredCars.length === 0 ? (
                                <Card className="border-sky-100">
                                    <CardContent className="p-6">
                                        <p className="font-semibold text-gray-800">Không có xe phù hợp</p>
                                        <p className="text-gray-600 mt-1 text-sm">Thử từ khoá khác hoặc bỏ lọc “AVAILABLE”.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCars.map((car) => {
                                        const badge = statusUI(car.status)

                                        return (
                                            <Card key={car.carId} className="border-sky-100 overflow-hidden hover:shadow-lg transition">
                                                <div className="relative w-full h-44 bg-white">
                                                    <img
                                                        src={toImg(car.imageUrl)}
                                                        alt={car.carName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            ;(e.currentTarget as HTMLImageElement).src = "/car-placeholder.jpg"
                                                        }}
                                                    />
                                                    <span
                                                        className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full border ${badge.cls}`}
                                                    >
                            {badge.label}
                          </span>

                                                    {car.featured ? (
                                                        <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full border bg-white/90 text-sky-700 border-sky-100">
                              Nổi bật
                            </span>
                                                    ) : null}
                                                </div>

                                                <CardContent className="p-5">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 leading-snug line-clamp-2">{car.carName}</p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {car.brandName} • {car.typeName}
                                                            </p>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="flex items-center justify-end gap-1 text-sky-700">
                                                                <Star className="h-4 w-4" />
                                                                <span className="text-sm font-semibold">{car.rating?.toFixed?.(1) ?? car.rating}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">{car.price ? `${car.price.toLocaleString("vi-VN")}₫` : "Liên hệ"}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-700">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-sky-700" />
                                                            <span>{car.seats} chỗ</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Fuel className="h-4 w-4 text-sky-700" />
                                                            <span>{car.fuelType}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-sky-700" />
                                                            <span>{car.year}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-sky-700" />
                                                            <span className="line-clamp-1">{car.location}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-5 flex gap-3">
                                                        {/* Nếu có route chi tiết xe: /user/cars/[id] thì đổi đúng route của bạn */}
                                                        <Link href={`/user/cars/${car.carId}`} className="flex-1">
                                                            <Button variant="outline" className="w-full">
                                                                Xem chi tiết
                                                            </Button>
                                                        </Link>
                                                        {car.status === "AVAILABLE" ? (
                                                            <Link href={`/user/booking?carId=${car.carId}`} className="flex-1">
                                                                <Button className="w-full bg-sky-600 hover:bg-sky-700">Đặt xe</Button>
                                                            </Link>
                                                        ) : (
                                                            <Button className="flex-1 w-full" disabled>
                                                                Không khả dụng
                                                            </Button>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
