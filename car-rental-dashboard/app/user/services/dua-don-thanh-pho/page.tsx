import Link from "next/link"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DuaDonThanhPhoPage() {
    const features = ["Đặt xe theo giờ", "Tài xế am hiểu địa phương", "Xe sạch sẽ, thoải mái", "Giá cả minh bạch"]

    return (
        <div className="min-h-screen bg-sky-50 py-12">
            <div className="container mx-auto px-4">
                <Link href="/user/services" className="text-sky-600 hover:underline">
                    ← Quay lại Dịch vụ
                </Link>

                <Card className="mt-6 border-sky-100">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="bg-sky-100 w-14 h-14 rounded-full flex items-center justify-center">
                                <MapPin className="h-7 w-7 text-sky-600" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Đưa Đón Thành Phố</CardTitle>
                                <p className="text-gray-600 mt-1">
                                    Di chuyển trong nội thành nhanh chóng, tiện lợi cho họp hành, mua sắm, tham quan.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <h3 className="font-semibold text-gray-800 mb-3">Điểm nổi bật</h3>
                        <ul className="space-y-2 text-gray-700">
                            {features.map((f, i) => (
                                <li key={i} className="flex items-center">
                                    <span className="w-2 h-2 bg-sky-500 rounded-full mr-3" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
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
        </div>
    )
}
