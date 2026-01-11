import Link from "next/link"
import {
    Clock,
    Siren,
    PhoneCall,
    MapPin,
    BadgeCheck,
    ShieldCheck,
    Wrench,
    Car,
    ClipboardList,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DichVuKhanCapPage() {
    const highlights = [
        "Hỗ trợ 24/7 – có mặt nhanh khi cần",
        "Đội cứu hộ chuyên nghiệp – xử lý đúng quy trình",
        "Phản hồi nhanh – ưu tiên trường hợp khẩn cấp",
        "Miễn phí trong bán kính 50km (theo chính sách)",
    ]

    const cases = [
        { title: "Xe chết máy / không nổ", desc: "Hỗ trợ kiểm tra ban đầu, kích bình/khắc phục tạm thời.", icon: Car },
        { title: "Thủng lốp / xì lốp", desc: "Hỗ trợ thay lốp dự phòng hoặc xử lý tạm để di chuyển.", icon: Wrench },
        { title: "Hết bình / điện yếu", desc: "Hỗ trợ kích nổ, kiểm tra ắc quy cơ bản.", icon: ShieldCheck },
        { title: "Sự cố giữa đường", desc: "Điều phối cứu hộ, kéo xe về điểm an toàn/bãi.", icon: Siren },
    ]

    const process = [
        { title: "Gọi/nhắn thông tin", desc: "Vị trí – tình trạng xe – biển số – số điện thoại liên hệ." },
        { title: "Điều phối cứu hộ", desc: "Xác nhận phương án hỗ trợ và thời gian dự kiến." },
        { title: "Xử lý tại chỗ / kéo xe", desc: "Khắc phục tạm thời hoặc đưa xe về nơi an toàn." },
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
                            <Clock className="h-7 w-7 text-white" />
                        </div>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Dịch Vụ Khẩn Cấp</h1>
                            <p className="mt-2 text-sky-100/90 leading-relaxed">
                                Hỗ trợ khẩn cấp khi xe gặp sự cố: phản hồi nhanh, hỗ trợ tận nơi và ưu tiên an toàn. Có thể xử lý tại chỗ
                                hoặc điều phối kéo xe về điểm an toàn tùy tình huống.
                            </p>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Link href="/user/contact">
                                    <Button className="bg-white text-sky-700 hover:bg-gray-100">
                                        Liên hệ khẩn cấp
                                    </Button>
                                </Link>
                                <Link href="/user/cars">
                                    <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                                        Xem danh sách xe
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <Siren className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Phản hồi nhanh</p>
                                        <p className="text-sky-100/80 text-sm">Ưu tiên khẩn cấp</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">An toàn</p>
                                        <p className="text-sky-100/80 text-sm">Xử lý đúng quy trình</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <PhoneCall className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">24/7</p>
                                        <p className="text-sky-100/80 text-sm">Luôn sẵn sàng hỗ trợ</p>
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
                    {/* Highlights + Cases */}
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
                                        <p className="font-semibold text-gray-800">Cần cung cấp khi gọi cứu hộ</p>
                                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                            <li>• Vị trí hiện tại (bật định vị hoặc gửi mốc gần nhất)</li>
                                            <li>• Tình trạng xe (không nổ máy / thủng lốp / chết bình...)</li>
                                            <li>• Biển số xe (nếu có) và số điện thoại liên hệ</li>
                                            <li>• Ảnh/video ngắn tình trạng để hỗ trợ chẩn đoán nhanh</li>
                                        </ul>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <Link href="/user/contact" className="flex-1">
                                            <Button className="w-full bg-sky-600 hover:bg-sky-700">Gửi yêu cầu hỗ trợ</Button>
                                        </Link>
                                        <Link href="/user/services" className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                Xem dịch vụ khác
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right */}
                        <div className="lg:col-span-7">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Tình huống hỗ trợ phổ biến</h2>
                                <p className="text-gray-600 mt-1">Tùy tình huống, đội cứu hộ sẽ xử lý tại chỗ hoặc điều phối kéo xe.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {cases.map((c, idx) => {
                                    const Icon = c.icon
                                    return (
                                        <Card key={idx} className="border-sky-100 hover:shadow-lg transition">
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-sky-100 w-12 h-12 rounded-2xl flex items-center justify-center">
                                                        <Icon className="h-6 w-6 text-sky-700" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{c.title}</p>
                                                        <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Process + Notes */}
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7">
                            <Card className="border-sky-100">
                                <CardHeader>
                                    <CardTitle className="text-xl">Quy trình hỗ trợ</CardTitle>
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
                                        <p className="font-semibold text-gray-800">Lưu ý an toàn</p>
                                        <ul className="mt-2 text-sm text-gray-700 space-y-1">
                                            <li>• Nếu xe dừng giữa đường, bật đèn cảnh báo và đặt tam giác phản quang (nếu có).</li>
                                            <li>• Ưu tiên đứng ở nơi an toàn, tránh khu vực có xe chạy nhanh.</li>
                                            <li>• Gửi vị trí chính xác để rút ngắn thời gian tiếp cận.</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-5">
                            <Card className="border-sky-100">
                                <CardHeader>
                                    <CardTitle className="text-xl">Hỗ trợ nhanh</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Nếu đang gặp sự cố, hãy gửi vị trí và mô tả ngắn. Đội cứu hộ sẽ phản hồi sớm và hướng dẫn thao tác
                                        an toàn khi chờ hỗ trợ.
                                    </p>

                                    <div className="mt-6 flex flex-col gap-3">
                                        <Link href="/user/contact">
                                            <Button className="w-full bg-sky-600 hover:bg-sky-700">Liên hệ ngay</Button>
                                        </Link>

                                        <div className="rounded-xl border border-sky-100 bg-white p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <MapPin className="h-4 w-4 text-sky-700" />
                                                <span>Miễn phí trong bán kính 50km (theo chính sách)</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                                                <ClipboardList className="h-4 w-4 text-sky-700" />
                                                <span>Khuyến nghị gửi ảnh/video để chẩn đoán nhanh</span>
                                            </div>
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
