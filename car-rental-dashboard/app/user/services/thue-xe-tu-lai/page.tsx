import Link from "next/link"
import {
    Car,
    ShieldCheck,
    Clock,
    FileCheck,
    KeyRound,
    BadgeCheck,
    Route,
    CreditCard,
    MapPin,
    PhoneCall,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ThueXeTuLaiPage() {
    const highlights = [
        "Đa dạng phân khúc: 4–7–16 chỗ, phổ thông đến cao cấp",
        "Thủ tục nhanh gọn – xác nhận nhanh theo lịch",
        "Bảo hiểm toàn diện – yên tâm di chuyển",
        "Hỗ trợ 24/7 – cứu hộ/đổi xe theo chính sách",
    ]

    const packages = [
        {
            title: "Thuê Theo Ngày",
            desc: "Phù hợp đi lại nội thành, công việc, gặp đối tác.",
            items: ["Giá theo ngày", "Nhận/trả linh hoạt", "Xe sạch sẽ – đổ xăng theo thực tế"],
        },
        {
            title: "Thuê Cuối Tuần",
            desc: "Phù hợp đi chơi ngắn, về quê, du lịch 1–2 ngày.",
            items: ["Ưu đãi theo khung giờ", "Tư vấn loại xe phù hợp", "Hỗ trợ đổi giờ (tùy điều kiện)"],
        },
        {
            title: "Thuê Dài Ngày",
            desc: "Phù hợp du lịch dài, công tác liên tỉnh.",
            items: ["Giá tốt hơn", "Hỗ trợ bảo dưỡng", "Ưu tiên điều xe"],
        },
    ]

    const documents = [
        "CCCD/CMND hoặc Hộ chiếu còn hạn",
        "Bằng lái xe hợp lệ (tối thiểu hạng B1/B2 tùy xe)",
        "Tài sản/tiền đặt cọc theo quy định (tùy loại xe)",
        "Thông tin liên hệ và địa chỉ xác minh (khi cần)",
    ]

    const process = [
        { title: "Chọn xe", desc: "Chọn dòng xe phù hợp số người và nhu cầu." },
        { title: "Gửi thông tin", desc: "Thời gian thuê – điểm nhận/trả – giấy tờ." },
        { title: "Ký hợp đồng", desc: "Xác nhận điều khoản, bảo hiểm và đặt cọc." },
        { title: "Nhận xe", desc: "Kiểm tra xe – chụp ảnh hiện trạng – bàn giao." },
        { title: "Trả xe", desc: "Đối soát nhiên liệu/hiện trạng – hoàn tất thanh toán." },
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* HERO */}
            <section
                className="relative py-16 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/car-rental-cta-background.jpg')",
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
                            <Car className="h-7 w-7 text-white" />
                        </div>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Thuê Xe Tự Lái</h1>
                            <p className="mt-2 text-sky-100/90 leading-relaxed">
                                Thuê xe tự lái đa phân khúc, thủ tục đơn giản. Xe được bảo dưỡng định kỳ, trang bị tiện nghi và hỗ trợ
                                24/7 trong suốt hành trình.
                            </p>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Link href="/user/contact">
                                    <Button className="bg-white text-sky-700 hover:bg-gray-100">Liên hệ tư vấn</Button>
                                </Link>
                                <Link href="/user/cars">
                                    <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                                        Xem danh sách xe
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Bảo hiểm toàn diện</p>
                                        <p className="text-sky-100/80 text-sm">Yên tâm sử dụng</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Thủ tục nhanh</p>
                                        <p className="text-sky-100/80 text-sm">Xác nhận theo lịch</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <KeyRound className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Đa dạng dòng xe</p>
                                        <p className="text-sky-100/80 text-sm">4–7–16 chỗ</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-14 bg-sky-50">
                <div className="container mx-auto px-4 space-y-10">
                    {/* Highlights + Packages */}
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Left */}
                        <div className="lg:col-span-5">
                            <Card className="border-sky-100">
                                <CardHeader>
                                    <CardTitle className="text-xl">Điểm nổi bật</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-gray-700">
                                        {highlights.map((t, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <BadgeCheck className="h-5 w-5 text-sky-600 mt-0.5" />
                                                <span>{t}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-6 rounded-xl bg-white p-4 border border-sky-100">
                                        <p className="font-semibold text-gray-800">Gợi ý chọn xe</p>
                                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                            <li>• Đi 1–3 người: sedan/hatchback</li>
                                            <li>• Gia đình 4–6 người: SUV/MPV 7 chỗ</li>
                                            <li>• Nhóm đông/hành lý nhiều: 16 chỗ</li>
                                        </ul>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <Link href="/user/contact" className="flex-1">
                                            <Button className="w-full bg-sky-600 hover:bg-sky-700">Nhận báo giá</Button>
                                        </Link>
                                        <Link href="/user/cars" className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                Chọn xe ngay
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right */}
                        <div className="lg:col-span-7">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Gói thuê phổ biến</h2>
                                <p className="text-gray-600 mt-1">Chọn gói theo nhu cầu để tối ưu chi phí.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {packages.map((p, idx) => (
                                    <Card key={idx} className="border-sky-100 hover:shadow-lg transition">
                                        <CardContent className="p-5">
                                            <div className="flex items-center gap-2 text-sky-700 font-semibold">
                                                <Car className="h-4 w-4" />
                                                <span>{p.title}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">{p.desc}</p>

                                            <ul className="mt-4 space-y-2 text-sm text-gray-700">
                                                {p.items.map((it, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-sky-500 rounded-full" />
                                                        <span>{it}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <Link href="/user/contact" className="block mt-5">
                                                <Button className="w-full bg-sky-600 hover:bg-sky-700">Đặt gói</Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Documents + Process */}
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7">
                            <Card className="border-sky-100">
                                <CardHeader>
                                    <CardTitle className="text-xl">Giấy tờ & điều kiện</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {documents.map((d, i) => (
                                            <div key={i} className="rounded-xl bg-white border border-sky-100 p-4 flex items-start gap-3">
                                                <FileCheck className="h-5 w-5 text-sky-700 mt-0.5" />
                                                <p className="text-sm text-gray-700">{d}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 rounded-xl bg-sky-100/60 border border-sky-100 p-4">
                                        <p className="font-semibold text-gray-800">Lưu ý bảo hiểm</p>
                                        <ul className="mt-2 text-sm text-gray-700 space-y-1">
                                            <li>• Vui lòng đọc kỹ điều khoản bảo hiểm & trách nhiệm bồi thường.</li>
                                            <li>• Nên chụp ảnh hiện trạng xe khi nhận và khi trả để đối soát nhanh.</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-5">
                            <Card className="border-sky-100">
                                <CardHeader>
                                    <CardTitle className="text-xl">Quy trình nhận/trả xe</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {process.map((step, i) => (
                                            <div key={i} className="rounded-xl bg-white border border-sky-100 p-4">
                                                <p className="text-sky-700 font-semibold">Bước {i + 1}: {step.title}</p>
                                                <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 rounded-xl border border-sky-100 bg-white p-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Route className="h-4 w-4 text-sky-700" />
                                            <span>Đi liên tỉnh: hỗ trợ tư vấn lộ trình</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 mt-2">
                                            <CreditCard className="h-4 w-4 text-sky-700" />
                                            <span>Thanh toán: linh hoạt theo chính sách</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 mt-2">
                                            <MapPin className="h-4 w-4 text-sky-700" />
                                            <span>Nhận/trả: theo điểm hẹn hoặc tại bãi</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col gap-3">
                                        <Link href="/user/contact">
                                            <Button className="w-full bg-sky-600 hover:bg-sky-700">Liên hệ đặt xe</Button>
                                        </Link>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <PhoneCall className="h-4 w-4 text-sky-700" />
                                            <span>Hỗ trợ 24/7</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
