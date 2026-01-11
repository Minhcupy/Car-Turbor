import Link from "next/link"
import {
    Globe,
    Route,
    Clock,
    MapPin,
    Camera,
    BadgeCheck,
    Car,
    Users,
    PhoneCall,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TourToanThanhPhoPage() {
    const highlights = [
        "Tài xế kiêm hướng dẫn – am hiểu điểm đến, gợi ý chụp ảnh đẹp",
        "Lịch trình linh hoạt – tùy chỉnh theo sở thích và thời gian",
        "Xe sạch sẽ, điều hòa mát, di chuyển thoải mái",
        "Giá tour trọn gói – minh bạch, dễ lựa chọn",
    ]

    const packages = [
        {
            title: "Tour 4 Giờ",
            desc: "Gợi ý cho lịch trình ngắn, check-in nhanh các điểm nổi bật.",
            items: ["2–3 điểm tham quan", "Dừng chụp ảnh linh hoạt", "Phù hợp nhóm nhỏ"],
        },
        {
            title: "Tour 8 Giờ",
            desc: "Lịch trình phổ biến nhất, đủ thời gian trải nghiệm nhiều điểm.",
            items: ["4–6 điểm tham quan", "Có thời gian ăn trưa", "Phù hợp gia đình/nhóm bạn"],
        },
        {
            title: "Tour 1 Ngày",
            desc: "Trọn ngày khám phá, tối ưu trải nghiệm và thời gian di chuyển.",
            items: ["6–8 điểm tham quan", "Tùy chọn điểm xa trung tâm", "Hỗ trợ kế hoạch chi tiết"],
        },
    ]

    const sampleSchedule = [
        { time: "08:00", title: "Đón khách", desc: "Đón tại khách sạn/điểm hẹn trong nội thành." },
        { time: "09:00", title: "Điểm check-in 1", desc: "Tham quan + chụp ảnh." },
        { time: "10:30", title: "Điểm check-in 2", desc: "Trải nghiệm văn hóa/địa danh nổi bật." },
        { time: "12:00", title: "Ăn trưa", desc: "Gợi ý quán theo nhu cầu (món địa phương/nhà hàng)." },
        { time: "14:00", title: "Điểm check-in 3", desc: "Tùy chỉnh theo sở thích: cafe, bảo tàng, công viên..." },
        { time: "16:30", title: "Mua sắm", desc: "Dừng mua quà lưu niệm nếu cần." },
        { time: "18:00", title: "Trả khách", desc: "Trả tại khách sạn/điểm hẹn." },
    ]

    const process = [
        { title: "Chọn gói tour", desc: "4 giờ / 8 giờ / 1 ngày." },
        { title: "Gửi yêu cầu", desc: "Số người – điểm đón – thời gian – nhu cầu đặc biệt." },
        { title: "Xác nhận", desc: "Chốt lịch trình & báo giá trọn gói." },
        { title: "Khởi hành", desc: "Tài xế đón đúng giờ – tour bắt đầu." },
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
                            <Globe className="h-7 w-7 text-white" />
                        </div>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Tour Toàn Thành Phố</h1>
                            <p className="mt-2 text-sky-100/90 leading-relaxed">
                                Trải nghiệm tour tham quan với lịch trình linh hoạt. Tài xế kiêm hướng dẫn sẽ đưa bạn đến những điểm nổi
                                bật nhất, gợi ý thời gian di chuyển và góc chụp ảnh đẹp.
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
                                    <Route className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Lịch trình linh hoạt</p>
                                        <p className="text-sky-100/80 text-sm">Tùy chỉnh theo sở thích</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Tối ưu thời gian</p>
                                        <p className="text-sky-100/80 text-sm">Đi đúng tuyến, ít vòng</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <Camera className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Gợi ý chụp ảnh</p>
                                        <p className="text-sky-100/80 text-sm">Check-in điểm đẹp</p>
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
                                            Chuẩn bị: số người, thời gian tour, điểm muốn đi (nếu có), nhu cầu xe (4–7–16 chỗ), có trẻ em/hành
                                            lý nhiều hay không.
                                        </p>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <Link href="/user/contact" className="flex-1">
                                            <Button className="w-full bg-sky-600 hover:bg-sky-700">Nhận tư vấn tour</Button>
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

                        <div className="lg:col-span-7">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Gói tour đề xuất</h2>
                                <p className="text-gray-600 mt-1">Chọn gói phù hợp với thời gian để tối ưu trải nghiệm.</p>
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

                    {/* Sample Schedule + Process */}
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7">
                            <Card className="border-sky-100">
                                <CardHeader>
                                    <CardTitle className="text-xl">Lịch trình mẫu (tham khảo)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {sampleSchedule.map((s, i) => (
                                            <div key={i} className="rounded-xl bg-white border border-sky-100 p-4 flex items-start gap-4">
                                                <div className="min-w-[62px] text-sky-700 font-semibold">{s.time}</div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{s.title}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 rounded-xl bg-sky-100/60 border border-sky-100 p-4">
                                        <p className="font-semibold text-gray-800">Lưu ý</p>
                                        <ul className="mt-2 text-sm text-gray-700 space-y-1">
                                            <li>• Lịch trình có thể thay đổi theo giao thông và nhu cầu cá nhân.</li>
                                            <li>• Có thể thêm điểm “cafe/ẩm thực/mua sắm” theo sở thích.</li>
                                            <li>• Nếu đi nhóm đông, nên chọn xe 7–16 chỗ để thoải mái.</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-5">
                            <Card className="border-sky-100">
                                <CardHeader>
                                    <CardTitle className="text-xl">Quy trình đặt tour</CardTitle>
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
                                            <Users className="h-4 w-4 text-sky-700" />
                                            <span>Phù hợp: cá nhân – gia đình – nhóm bạn – khách công tác</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 mt-2">
                                            <MapPin className="h-4 w-4 text-sky-700" />
                                            <span>Đón/trả: nội thành theo yêu cầu</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col gap-3">
                                        <Link href="/user/contact">
                                            <Button className="w-full bg-sky-600 hover:bg-sky-700">Liên hệ lên lịch tour</Button>
                                        </Link>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <PhoneCall className="h-4 w-4 text-sky-700" />
                                            <span>Hỗ trợ nhanh: 24/7</span>
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
