import Link from "next/link"
import {
    Wrench,
    BadgeCheck,
    ShieldCheck,
    Clock,
    ClipboardList,
    Car,
    PhoneCall,
    MapPin,
    Cog,
    Droplet,
    Disc3,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BaoDuongSuaChuaPage() {
    const highlights = [
        "Kỹ thuật viên chuyên nghiệp – kinh nghiệm thực tế, thao tác chuẩn",
        "Phụ tùng chính hãng – ưu tiên chất lượng, an toàn vận hành",
        "Bảo hành dài hạn – minh bạch điều kiện bảo hành",
        "Giá cả hợp lý – báo giá trước, hạn chế phát sinh",
    ]

    const services = [
        {
            title: "Bảo dưỡng định kỳ",
            desc: "Thay dầu, lọc dầu, lọc gió, kiểm tra tổng thể theo mốc km.",
            icon: Droplet,
        },
        {
            title: "Kiểm tra phanh – lốp",
            desc: "Kiểm tra má phanh, đĩa phanh, áp suất lốp, đảo lốp – cân bằng.",
            icon: Disc3,
        },
        {
            title: "Động cơ – hộp số",
            desc: "Kiểm tra tiếng ồn, rung giật, rò rỉ, tối ưu vận hành.",
            icon: Cog,
        },
        {
            title: "Điện – điều hòa",
            desc: "Kiểm tra ắc quy, hệ thống điện, điều hòa, cảm biến cơ bản.",
            icon: Car,
        },
    ]

    const process = [
        { title: "Tiếp nhận", desc: "Ghi nhận tình trạng, nhu cầu và lịch sử xe (nếu có)." },
        { title: "Kiểm tra", desc: "Chẩn đoán – kiểm tra hạng mục, báo lỗi/đề xuất xử lý." },
        { title: "Báo giá", desc: "Báo giá rõ ràng trước khi sửa – thống nhất hạng mục." },
        { title: "Thực hiện", desc: "Sửa chữa/bảo dưỡng theo quy trình – đảm bảo an toàn." },
        { title: "Kiểm tra lại", desc: "Test vận hành, rà soát lỗi, bàn giao và tư vấn." },
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* HERO */}
            <section
                className="relative py-16 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/professional-car-service-team.jpg')",
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
                            <Wrench className="h-7 w-7 text-white" />
                        </div>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                                Bảo Dưỡng & Sửa Chữa
                            </h1>
                            <p className="mt-2 text-sky-100/90 leading-relaxed">
                                Dịch vụ bảo dưỡng và sửa chữa chuyên nghiệp với quy trình rõ ràng, thiết bị hiện đại và đội ngũ kỹ thuật
                                viên giàu kinh nghiệm. Ưu tiên an toàn – minh bạch – tiết kiệm.
                            </p>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Link href="/user/contact">
                                    <Button className="bg-white text-sky-700 hover:bg-gray-100">Đặt lịch tư vấn</Button>
                                </Link>
                                <Link href="/user/cars">
                                    <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                                        Xem xe đang có
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Chính hãng</p>
                                        <p className="text-sky-100/80 text-sm">Phụ tùng rõ nguồn</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Nhanh chóng</p>
                                        <p className="text-sky-100/80 text-sm">Có lịch hẹn rõ</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-4 flex items-center gap-3">
                                    <ClipboardList className="h-5 w-5 text-white" />
                                    <div>
                                        <p className="text-white font-semibold">Minh bạch</p>
                                        <p className="text-sky-100/80 text-sm">Báo giá trước</p>
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
                    {/* Highlights + Services */}
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
                                        <p className="font-semibold text-gray-800">Gợi ý trước khi mang xe đến</p>
                                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                            <li>• Ghi lại triệu chứng: tiếng ồn, rung, hao xăng, đèn báo lỗi…</li>
                                            <li>• Nếu có lịch sử bảo dưỡng gần nhất, cung cấp để chẩn đoán nhanh.</li>
                                            <li>• Đặt lịch trước để được ưu tiên tiếp nhận.</li>
                                        </ul>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <Link href="/user/contact" className="flex-1">
                                            <Button className="w-full bg-sky-600 hover:bg-sky-700">Đặt lịch kiểm tra</Button>
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

                        <div className="lg:col-span-7">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Hạng mục dịch vụ</h2>
                                <p className="text-gray-600 mt-1">Các hạng mục phổ biến – có thể tùy chỉnh theo tình trạng xe.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {services.map((s, idx) => {
                                    const Icon = s.icon
                                    return (
                                        <Card key={idx} className="border-sky-100 hover:shadow-lg transition">
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-sky-100 w-12 h-12 rounded-2xl flex items-center justify-center">
                                                        <Icon className="h-6 w-6 text-sky-700" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{s.title}</p>
                                                        <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Process + Support */}
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7">
                            <Card className="border-sky-100">
                                <CardHeader>
                                    <CardTitle className="text-xl">Quy trình bảo dưỡng/sửa chữa</CardTitle>
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
                                        <p className="font-semibold text-gray-800">Cam kết</p>
                                        <ul className="mt-2 text-sm text-gray-700 space-y-1">
                                            <li>• Báo giá trước khi thực hiện, minh bạch hạng mục.</li>
                                            <li>• Ưu tiên phụ tùng chính hãng/đúng tiêu chuẩn.</li>
                                            <li>• Có bảo hành theo chính sách cho hạng mục sửa chữa.</li>
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
                                        Gửi mô tả lỗi + dòng xe + năm xe + tình trạng hiện tại để được tư vấn hướng xử lý nhanh.
                                    </p>

                                    <div className="mt-6 flex flex-col gap-3">
                                        <Link href="/user/contact">
                                            <Button className="w-full bg-sky-600 hover:bg-sky-700">Liên hệ ngay</Button>
                                        </Link>

                                        <div className="rounded-xl border border-sky-100 bg-white p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <MapPin className="h-4 w-4 text-sky-700" />
                                                <span>Tiếp nhận tại nội thành (theo lịch hẹn)</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                                                <PhoneCall className="h-4 w-4 text-sky-700" />
                                                <span>Hỗ trợ tư vấn nhanh – phản hồi sớm</span>
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
