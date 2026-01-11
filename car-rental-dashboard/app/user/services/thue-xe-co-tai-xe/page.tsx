import Link from "next/link"
import {
    Users,
    ShieldCheck,
    Clock,
    BadgeCheck,
    Car,
    Route,
    Briefcase,
    CalendarCheck,
    PhoneCall,
    MapPin,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ThueXeCoTaiXePage() {
    const highlights = [
        "Tài xế kinh nghiệm – tác phong lịch sự, thông thạo tuyến đường",
        "Xe đời mới – sạch sẽ, điều hòa mát, tiện nghi đầy đủ",
        "Phục vụ tận tình – hỗ trợ đón/trả, dừng điểm linh hoạt",
        "Giá cạnh tranh – báo giá rõ ràng, hạn chế phát sinh",
    ]

    const packages = [
        {
            title: "Theo Tuyến",
            desc: "Phù hợp đưa đón 1–2 điểm cố định (nội thành/ngoại thành gần).",
            items: ["Báo giá trước", "Đi đúng tuyến", "Đón/trả đúng giờ"],
            icon: Route,
        },
        {
            title: "Theo Giờ",
            desc: "Phù hợp lịch trình nhiều điểm: gặp đối tác, công việc trong ngày.",
            items: ["Linh hoạt điểm dừng", "Tối ưu thời gian", "Có thời gian chờ"],
            icon: Clock,
        },
        {
            title: "Theo Ngày",
            desc: "Phù hợp du lịch, sự kiện, công tác liên tục cả ngày.",
            items: ["Lịch trình trọn ngày", "Tài xế hỗ trợ", "Ưu tiên xe phù hợp"],
            icon: CalendarCheck,
        },
    ]

    const process = [
        { title: "Gửi yêu cầu", desc: "Thời gian – điểm đón – điểm đến – số người – số điểm dừng." },
        { title: "Tư vấn xe phù hợp", desc: "Gợi ý dòng xe theo số chỗ, hành lý, mục đích chuyến đi." },
        { title: "Xác nhận đặt xe", desc: "Chốt lịch trình – báo giá minh bạch – xác nhận tài xế." },
        { title: "Khởi hành", desc: "Tài xế liên hệ trước, đến đúng giờ, phục vụ theo lịch." },
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
                            <Users className="h-7 w-7 text-white" />
                        </div>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Thuê Xe Có Tài Xế</h1>
                            <p className="mt-2 text-sky-100/90 leading-relaxed">
                                Phù hợp du lịch, công tác, sự kiện với tài xế chuyên nghiệp. Ưu tiên đúng giờ, an toàn, xe đời mới – sạch
                                sẽ – tiện nghi, phục vụ tận tình theo lịch trình.
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

                            {/* quick highlights */}
                            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">An toàn</p>
                                        <p className="text-sky-100/80 text-sm">Xe kiểm tra định kỳ</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <Briefcase className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Chuyên nghiệp</p>
                                        <p className="text-sky-100/80 text-sm">Tài xế lịch sự</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Linh hoạt</p>
                                        <p className="text-sky-100/80 text-sm">Theo tuyến / theo giờ</p>
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
                                            <li>• Đi nội thành: sedan / SUV</li>
                                            <li>• Gia đình + hành lý: SUV/MPV 7 chỗ</li>
                                            <li>• Nhóm đông/sự kiện: 16 chỗ</li>
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
                                <p className="text-gray-600 mt-1">Chọn gói theo nhu cầu để tối ưu chi phí và lịch trình.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {packages.map((p, idx) => {
                                    const Icon = p.icon
                                    return (
                                        <Card key={idx} className="border-sky-100 hover:shadow-lg transition">
                                            <CardContent className="p-5">
                                                <div className="flex items-center gap-2 text-sky-700 font-semibold">
                                                    <Icon className="h-4 w-4" />
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
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Process + Commitments */}
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
                                        <p className="font-semibold text-gray-800">Cam kết dịch vụ</p>
                                        <ul className="mt-2 text-sm text-gray-700 space-y-1">
                                            <li>• Tài xế đến đúng giờ, liên hệ trước khi tới.</li>
                                            <li>• Xe sạch sẽ, kiểm tra định kỳ, ưu tiên an toàn.</li>
                                            <li>• Báo giá minh bạch theo gói/điểm đến, hạn chế phát sinh.</li>
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
                                        Gửi thông tin: thời gian, điểm đón/trả, số người, số điểm dừng để nhận tư vấn nhanh và báo giá.
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
                                            <span>Hỗ trợ 24/7 – phản hồi nhanh</span>
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
