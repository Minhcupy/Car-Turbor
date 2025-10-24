import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const pricingData = [
  {
    id: 1,
    name: "Mercedes C-Class",
    image: "/mercedes-c-class-sedan.jpg",
    rating: 5,
    hourlyRate: 150000,
    dailyRate: 1200000,
    monthlyRate: 25000000,
    fuelSurcharge: 50000,
  },
  {
    id: 2,
    name: "Toyota Camry",
    image: "/toyota-camry-sedan.png",
    rating: 5,
    hourlyRate: 100000,
    dailyRate: 800000,
    monthlyRate: 18000000,
    fuelSurcharge: 40000,
  },
  {
    id: 3,
    name: "Honda CR-V",
    image: "/honda-crv-suv.png",
    rating: 5,
    hourlyRate: 120000,
    dailyRate: 1000000,
    monthlyRate: 22000000,
    fuelSurcharge: 45000,
  },
  {
    id: 4,
    name: "BMW X3",
    image: "/bmw-x3-suv.jpg",
    rating: 5,
    hourlyRate: 180000,
    dailyRate: 1500000,
    monthlyRate: 30000000,
    fuelSurcharge: 60000,
  },
  {
    id: 5,
    name: "Hyundai Accent",
    image: "/hyundai-accent-sedan.jpg",
    rating: 4,
    hourlyRate: 80000,
    dailyRate: 600000,
    monthlyRate: 15000000,
    fuelSurcharge: 35000,
  },
  {
    id: 6,
    name: "Ford Everest",
    image: "/ford-everest-suv.jpg",
    rating: 5,
    hourlyRate: 160000,
    dailyRate: 1300000,
    monthlyRate: 28000000,
    fuelSurcharge: 55000,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: "url('/professional-car-service-team.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/80 to-sky-600/60"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end">
          <div className="text-white pb-12">
            <nav className="text-sky-200 mb-4">
              <Link href="/" className="hover:text-white">
                Trang Chủ
              </Link>
              <span className="mx-2">→</span>
              <span>Bảng Giá</span>
            </nav>
            <h1 className="text-4xl font-bold">Bảng Giá</h1>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-16 bg-sky-50">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-sky-100">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-center">
                      <th className="p-4 bg-white border-b border-sky-100"></th>
                      <th className="p-4 bg-white border-b border-sky-100"></th>
                      <th className="p-4 bg-sky-500 text-white border-b border-sky-600">Giá Theo Giờ</th>
                      <th className="p-4 bg-gray-800 text-white border-b border-gray-900">Giá Theo Ngày</th>
                      <th className="p-4 bg-gray-900 text-white border-b border-black">Thuê Dài Hạn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingData.map((car, index) => (
                      <tr key={car.id} className={index % 2 === 0 ? "bg-white" : "bg-sky-50"}>
                        {/* Car Image */}
                        <td className="p-4">
                          <div
                            className="w-24 h-16 bg-cover bg-center rounded"
                            style={{ backgroundImage: `url(${car.image})` }}
                          ></div>
                        </td>

                        {/* Car Info */}
                        <td className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-2">{car.name}</h3>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-600">Đánh giá:</span>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < car.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                        </td>

                        {/* Hourly Rate */}
                        <td className="p-4 text-center">
                          <Button className="bg-sky-500 hover:bg-sky-600 text-white mb-3 text-sm">Thuê xe</Button>
                          <div>
                            <div className="text-2xl font-bold text-sky-600">
                              {car.hourlyRate.toLocaleString()}đ
                              <span className="text-sm font-normal text-gray-600">/giờ</span>
                            </div>
                            <div className="text-xs text-gray-500">{car.fuelSurcharge.toLocaleString()}đ phí xăng</div>
                          </div>
                        </td>

                        {/* Daily Rate */}
                        <td className="p-4 text-center">
                          <Button className="bg-gray-800 hover:bg-gray-900 text-white mb-3 text-sm">Thuê xe</Button>
                          <div>
                            <div className="text-2xl font-bold text-gray-800">
                              {car.dailyRate.toLocaleString()}đ
                              <span className="text-sm font-normal text-gray-600">/ngày</span>
                            </div>
                            <div className="text-xs text-gray-500">{car.fuelSurcharge.toLocaleString()}đ phí xăng</div>
                          </div>
                        </td>

                        {/* Monthly Rate */}
                        <td className="p-4 text-center">
                          <Button className="bg-gray-900 hover:bg-black text-white mb-3 text-sm">Thuê xe</Button>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {car.monthlyRate.toLocaleString()}đ
                              <span className="text-sm font-normal text-gray-600">/tháng</span>
                            </div>
                            <div className="text-xs text-gray-500">{car.fuelSurcharge.toLocaleString()}đ phí xăng</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Notes */}
          <div className="mt-8 bg-white p-6 rounded-lg border border-sky-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Lưu Ý Về Giá Cả</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Giá đã bao gồm:</h4>
                <ul className="space-y-1">
                  <li>• Bảo hiểm cơ bản</li>
                  <li>• Bảo dưỡng định kỳ</li>
                  <li>• Hỗ trợ 24/7</li>
                  <li>• Giao nhận xe tại địa điểm</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Phí phát sinh:</h4>
                <ul className="space-y-1">
                  <li>• Phí xăng theo km đi</li>
                  <li>• Phí vượt quá giới hạn km</li>
                  <li>• Phí làm sạch nếu xe quá bẩn</li>
                  <li>• Phí phạt nếu trả xe muộn</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-sky-500 to-sky-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Cần Tư Vấn Thêm?</h2>
          <p className="text-sky-100 text-lg mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn gói thuê xe phù hợp nhất với nhu cầu của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-sky-600 hover:bg-gray-100 px-8">
                Liên Hệ Tư Vấn
              </Button>
            </Link>
            <Link href="/cars">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 bg-transparent"
              >
                Xem Danh Sách Xe
              </Button>
            </Link>
          </div>
        </div>
      </section>


    </div>
  )
}
