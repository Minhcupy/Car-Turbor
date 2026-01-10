import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Shield, Clock, Users, MapPin, Wrench, Heart, Globe } from "lucide-react"

const SERVICES = [
    {
        slug: "le-cuoi",
        icon: Heart,
        title: "Lễ Cưới",
        description:
            "Dịch vụ xe cưới sang trọng với đội xe hoa và trang trí đặc biệt cho ngày trọng đại của bạn.",
        features: ["Xe hoa trang trí", "Tài xế chuyên nghiệp", "Phục vụ cả ngày", "Giá cả hợp lý"],
    },
    {
        slug: "dua-don-thanh-pho",
        icon: MapPin,
        title: "Đưa Đón Thành Phố",
        description:
            "Dịch vụ đưa đón trong thành phố tiện lợi và nhanh chóng, phù hợp cho các chuyến đi ngắn.",
        features: ["Đặt xe theo giờ", "Tài xế am hiểu địa phương", "Xe sạch sẽ, thoải mái", "Giá cả minh bạch"],
    },
    {
        slug: "dua-don-san-bay",
        icon: Shield,
        title: "Đưa Đón Sân Bay",
        description:
            "Dịch vụ đưa đón sân bay chuyên nghiệp 24/7, theo dõi chuyến bay và đón tận nơi.",
        features: ["Phục vụ 24/7", "Theo dõi chuyến bay", "Đón tận cửa", "Hỗ trợ hành lý"],
    },
    {
        slug: "tour-toan-thanh-pho",
        icon: Globe,
        title: "Tour Toàn Thành Phố",
        description:
            "Khám phá thành phố với tài xế kiêm hướng dẫn viên, lịch trình linh hoạt, xe tiện nghi.",
        features: ["Hướng dẫn viên chuyên nghiệp", "Lịch trình linh hoạt", "Xe có điều hòa", "Giá tour trọn gói"],
    },
    {
        slug: "thue-xe-tu-lai",
        icon: Car,
        title: "Thuê Xe Tự Lái",
        description:
            "Cho thuê xe tự lái đa dạng phân khúc, thủ tục nhanh gọn, hỗ trợ 24/7.",
        features: ["Đa dạng loại xe", "Thủ tục nhanh gọn", "Bảo hiểm toàn diện", "Hỗ trợ 24/7"],
    },
    {
        slug: "thue-xe-co-tai-xe",
        icon: Users,
        title: "Thuê Xe Có Tài Xế",
        description:
            "Thuê xe có tài xế chuyên nghiệp, phù hợp du lịch, công tác, sự kiện.",
        features: ["Tài xế kinh nghiệm", "Xe đời mới", "Phục vụ tận tình", "Giá cả cạnh tranh"],
    },
    {
        slug: "bao-duong-sua-chua",
        icon: Wrench,
        title: "Bảo Dưỡng & Sửa Chữa",
        description:
            "Bảo dưỡng & sửa chữa xe chuyên nghiệp với kỹ thuật viên giàu kinh nghiệm.",
        features: ["Kỹ thuật viên chuyên nghiệp", "Phụ tùng chính hãng", "Bảo hành dài hạn", "Giá cả hợp lý"],
    },
    {
        slug: "dich-vu-khan-cap",
        icon: Clock,
        title: "Dịch Vụ Khẩn Cấp",
        description:
            "Hỗ trợ khẩn cấp 24/7 khi xe gặp sự cố, phản hồi nhanh, cứu hộ chuyên nghiệp.",
        features: ["Hỗ trợ 24/7", "Đội cứu hộ chuyên nghiệp", "Thời gian phản hồi nhanh", "Miễn phí trong bán kính 50km"],
    },
] as const

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const service = SERVICES.find((s) => s.slug === params.slug)
    if (!service) return notFound()

    const Icon = service.icon

    return (
        <div className="min-h-screen bg-sky-50">
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-6">
                        <Link href="/user/services" className="text-sky-600 hover:underline">
                            ← Quay lại Dịch vụ
                        </Link>
                    </div>

                    <Card className="border-sky-100">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="bg-sky-100 w-14 h-14 rounded-full flex items-center justify-center">
                                    <Icon className="h-7 w-7 text-sky-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                                    <p className="text-gray-600 mt-1">{service.description}</p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <h3 className="font-semibold text-gray-800 mb-3">Điểm nổi bật</h3>
                            <ul className="text-gray-700 space-y-2 mb-8">
                                {service.features.map((f, i) => (
                                    <li key={i} className="flex items-center">
                                        <span className="w-2 h-2 bg-sky-500 rounded-full mr-3" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/user/contact">
                                    <Button className="bg-sky-600 hover:bg-sky-700">Liên hệ tư vấn</Button>
                                </Link>
                                <Link href="/user/cars">
                                    <Button variant="outline">Xem danh sách xe</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
