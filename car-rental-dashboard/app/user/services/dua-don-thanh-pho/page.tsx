import Link from "next/link"
import { MapPin, Clock, ShieldCheck, Car, Route, BadgeCheck, PhoneCall } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DuaDonThanhPhoPage() {
    const highlights = [
        "Đặt xe theo giờ hoặc theo lộ trình linh hoạt",
        "Tài xế am hiểu địa phương, hỗ trợ điểm đón/trả",
        "Xe sạch sẽ, tiện nghi – điều hòa mát, không mùi",
        "Giá minh bạch, không phát sinh bất ngờ",
    ]

    const packages = [
        {
            title: "Gói Theo Giờ",
            desc: "Phù hợp đi họp, chạy nhiều điểm trong ngày.",
            items: ["Tối ưu thời gian chờ", "Linh hoạt đổi điểm đến", "Hỗ trợ dừng đón/trả"],
        },
        {
            title: "Gói Theo Tuyến",
            desc: "Phù hợp di chuyển 1–2 điểm cố định trong nội thành.",
            items: ["Báo giá trước", "Tài xế đến đúng giờ", "Đưa đón nhanh gọn"],
        },
        {
            title: "Gói Công Tác",
            desc: "Phù hợp khách hàng doanh nghiệp, lịch trình dày.",
            items: ["Ưu tiên xe đời mới", "Hỗ trợ hóa đơn", "Chăm sóc khách hàng riêng"],
        },
    ]

    const process = [
        { title: "Gửi yêu cầu", desc: "Chọn điểm đón – điểm đến – thời gian." },
        { title: "Xác nhận", desc: "Nhận báo giá minh bạch và xác nhận đặt xe." },
        { title: "Đón khách", desc: "Tài xế đến đúng giờ, liên hệ trước khi tới." },
        { title: "Kết thúc", desc: "Thanh toán thuận tiện, hỗ trợ hóa đơn nếu cần." },
    ]

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
                            <MapPin className="h-7 w-7 text-white" />
                        </div>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Đưa Đón Thành Phố</h1>
                            <p className="mt-2 text-sky-100/90 leading-relaxed">
                                Dịch vụ đưa đón nội thành linh hoạt theo giờ hoặc theo tuyến. Phù hợp cho đi họp, công tác, mua sắm,
                                thăm người thân và tham quan. Ưu tiên đúng giờ, an toàn và trải nghiệm thoải mái.
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
                                    <Clock className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Đúng giờ</p>
                                        <p className="text-sky-100/80 text-sm">Tài xế liên hệ trước</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">An toàn</p>
                                        <p className="text-sky-100/80 text-sm">Xe kiểm tra định kỳ</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <Route className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Linh hoạt</p>
                                        <p className="text-sky-100/80 text-sm">Theo giờ / theo tuyến</p>
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
                    {/* Highlights + Quick CTA */}
                    <div className="grid lg:grid-cols-12 gap-8">
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
                                        <p className="font-semibold text-gray-800">Gợi ý đặt nhanh</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Chuẩn bị điểm đón – điểm đến – thời gian – số người – số điểm dừng (nếu có) để nhận báo giá chính xác.
                                        </p>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <Link href="/user/contact" className="flex-1">
                                            <Button className="w-full bg-sky-600 hover:bg-sky-700">Nhận báo giá</Button>
                                        </Link>
                                        <Link href="/user/cars" className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                Chọn xe phù hợp
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Packages */}
                        <div className="lg:col-span-7">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Gói dịch vụ đề xuất</h2>
                                <p className="text-gray-600 mt-1">Chọn gói phù hợp với lịch trình để tối ưu chi phí và thời gian.</p>
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

                    {/* Process + Notes */}
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7">
                            <Card className="border-sky-100">
                                <CardHeader>
                                    <CardTitle className="text-xl">Quy trình đặt xe</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {process.map((step, i) => (
                                            <div key={i} className="rounded-xl bg-white border border-sky-100 p-4">
                                                <p className="text-sky-700 font-semibold">Bước {i + 1}: {step.title}</p>
                                                <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 rounded-xl bg-sky-100/60 border border-sky-100 p-4">
                                        <p className="font-semibold text-gray-800">Lưu ý</p>
                                        <ul className="mt-2 text-sm text-gray-700 space-y-1">
                                            <li>• Vui lòng đặt trước vào giờ cao điểm để đảm bảo có xe.</li>
                                            <li>• Nếu có nhiều điểm dừng, nên chọn gói theo giờ để tối ưu.</li>
                                            <li>• Có thể yêu cầu xe theo số chỗ / dòng xe / màu xe (tùy tình trạng xe).</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-5">
                            <Card className="border-sky-100">
                                <CardHeader>
                                    <CardTitle className="text-xl">Cần hỗ trợ nhanh?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Nhắn thông tin chuyến đi để nhận tư vấn: điểm đón, điểm đến, thời gian, số người, số điểm dừng.
                                    </p>

                                    <div className="mt-6 flex flex-col gap-3">
                                        <Link href="/user/contact">
                                            <Button className="w-full bg-sky-600 hover:bg-sky-700">Liên hệ ngay</Button>
                                        </Link>
                                        <Link href="/user/cars">
                                            <Button variant="outline" className="w-full">
                                                Xem xe đang có
                                            </Button>
                                        </Link>

                                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                            <PhoneCall className="h-4 w-4 text-sky-700" />
                                            <span>Hỗ trợ: 24/7 (giờ cao điểm phản hồi nhanh)</span>
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
