import Link from "next/link"
import { Car, Shield, Clock, Users, MapPin, Wrench, Heart, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type ServiceItem = {
  slug: string
  icon: any
  title: string
  description: string
  features: string[]
}

export default function ServicesPage() {
  const services: ServiceItem[] = [
    {
      slug: "le-cuoi",
      icon: Heart,
      title: "Lễ Cưới",
      description:
          "Dịch vụ xe cưới sang trọng với đội xe hoa và trang trí theo yêu cầu, phù hợp cho ngày trọng đại.",
      features: ["Xe hoa trang trí", "Tài xế chuyên nghiệp", "Phục vụ cả ngày", "Giá cả hợp lý"],
    },
    {
      slug: "dua-don-thanh-pho",
      icon: MapPin,
      title: "Đưa Đón Thành Phố",
      description:
          "Dịch vụ đưa đón trong thành phố nhanh chóng, tiện lợi cho đi lại, họp hành, mua sắm và tham quan.",
      features: ["Đặt xe theo giờ", "Tài xế am hiểu địa phương", "Xe sạch sẽ, thoải mái", "Giá cả minh bạch"],
    },
    {
      slug: "dua-don-san-bay",
      icon: Shield,
      title: "Đưa Đón Sân Bay",
      description:
          "Đưa đón sân bay 24/7, theo dõi chuyến bay, đón tận nơi và hỗ trợ hành lý chu đáo.",
      features: ["Phục vụ 24/7", "Theo dõi chuyến bay", "Đón tận cửa", "Hỗ trợ hành lý"],
    },
    {
      slug: "tour-toan-thanh-pho",
      icon: Globe,
      title: "Tour Toàn Thành Phố",
      description:
          "Khám phá thành phố theo lịch trình linh hoạt với tài xế kiêm hướng dẫn viên chuyên nghiệp.",
      features: ["Hướng dẫn viên chuyên nghiệp", "Lịch trình linh hoạt", "Xe có điều hòa", "Giá tour trọn gói"],
    },
    {
      slug: "thue-xe-tu-lai",
      icon: Car,
      title: "Thuê Xe Tự Lái",
      description:
          "Cho thuê xe tự lái đa dạng phân khúc, thủ tục nhanh gọn, xe bảo dưỡng định kỳ.",
      features: ["Đa dạng loại xe", "Thủ tục nhanh gọn", "Bảo hiểm toàn diện", "Hỗ trợ 24/7"],
    },
    {
      slug: "thue-xe-co-tai-xe",
      icon: Users,
      title: "Thuê Xe Có Tài Xế",
      description:
          "Thuê xe có tài xế chuyên nghiệp, phù hợp du lịch, công tác và các sự kiện quan trọng.",
      features: ["Tài xế kinh nghiệm", "Xe đời mới", "Phục vụ tận tình", "Giá cả cạnh tranh"],
    },
    {
      slug: "bao-duong-sua-chua",
      icon: Wrench,
      title: "Bảo Dưỡng & Sửa Chữa",
      description:
          "Bảo dưỡng và sửa chữa xe chuyên nghiệp với kỹ thuật viên giàu kinh nghiệm và thiết bị hiện đại.",
      features: ["Kỹ thuật viên chuyên nghiệp", "Phụ tùng chính hãng", "Bảo hành dài hạn", "Giá cả hợp lý"],
    },
    {
      slug: "dich-vu-khan-cap",
      icon: Clock,
      title: "Dịch Vụ Khẩn Cấp",
      description:
          "Hỗ trợ khẩn cấp 24/7 khi xe gặp sự cố, phản hồi nhanh và cứu hộ chuyên nghiệp.",
      features: ["Hỗ trợ 24/7", "Đội cứu hộ chuyên nghiệp", "Thời gian phản hồi nhanh", "Miễn phí trong bán kính 50km"],
    },
  ]

  return (
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section
            className="relative py-20 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/car-service-hero-background.jpg')",
              backgroundColor: "#0c4a6e",
            }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 to-sky-700/80" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Dịch Vụ</h1>
            <p className="text-sky-100 text-lg max-w-2xl mx-auto drop-shadow-md">
              Danh mục dịch vụ đa dạng, đáp ứng nhu cầu di chuyển và chăm sóc xe một cách chuyên nghiệp.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-sky-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sky-600 font-medium">Danh mục</span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">Dịch Vụ Nổi Bật</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Mỗi dịch vụ có trang chi tiết riêng. Nhấn vào từng thẻ để xem thêm thông tin.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service) => {
                const Icon = service.icon

                return (
                    <Link
                        key={service.slug}
                        href={`/user/services/${service.slug}`}
                        aria-label={`Xem chi tiết dịch vụ ${service.title}`}
                        className="block group focus:outline-none"
                    >
                      <Card className="bg-white border-sky-100 transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02] focus-within:ring-2 focus-within:ring-sky-300">
                        <CardContent className="p-6 text-center">
                          <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-sky-200">
                            <Icon className="h-10 w-10 text-sky-600" />
                          </div>

                          <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>

                          <ul className="text-sm text-gray-500 space-y-1">
                            {service.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center justify-center">
                                  <span className="w-2 h-2 bg-sky-400 rounded-full mr-2" />
                                  {feature}
                                </li>
                            ))}
                          </ul>

                          <div className="mt-5 text-sky-700 font-medium text-sm group-hover:underline">
                            Xem chi tiết →
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sky-600 font-medium">Tại sao chọn</span>
                <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-6">Cam Kết Chất Lượng</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-sky-100 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">An Toàn</h4>
                      <p className="text-gray-600">Xe bảo dưỡng định kỳ, vận hành an toàn và có bảo hiểm phù hợp.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-sky-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Hỗ Trợ 24/7</h4>
                      <p className="text-gray-600">Hỗ trợ mọi lúc, kể cả ngày lễ và ngoài giờ.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-sky-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Đội Ngũ Chuyên Nghiệp</h4>
                      <p className="text-gray-600">Nhân sự được đào tạo bài bản, tác phong phục vụ rõ ràng.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                  className="h-96 bg-cover bg-center rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  style={{ backgroundImage: "url('/professional-car-service-team.jpg')" }}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
            className="py-16 bg-cover bg-center relative"
            style={{ backgroundImage: "url('/car-rental-cta-background.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/90 to-sky-600/90" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Sẵn Sàng Trải Nghiệm?</h2>
            <p className="text-sky-100 text-lg mb-8 max-w-2xl mx-auto drop-shadow-md">
              Liên hệ để được tư vấn nhanh và lựa chọn dịch vụ phù hợp.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/user/cars">
                <Button
                    size="lg"
                    className="bg-white text-sky-700 hover:bg-gray-100 px-8 hover:scale-105 transition-all duration-300"
                >
                  Xem Danh Sách Xe
                </Button>
              </Link>

              <Link href="/user/contact">
                <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 bg-transparent hover:scale-105 transition-all duration-300"
                >
                  Liên Hệ Ngay
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
  )
}
