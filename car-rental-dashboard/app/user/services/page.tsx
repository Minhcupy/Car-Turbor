import { Car, Shield, Clock, Users, MapPin, Wrench, Heart, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Heart,
      title: "Lễ Cưới",
      description:
        "Dịch vụ xe cưới sang trọng với đội xe hoa và trang trí đặc biệt cho ngày trọng đại của bạn. Chúng tôi cung cấp các mẫu xe cao cấp được trang trí theo yêu cầu.",
      features: ["Xe hoa trang trí", "Tài xế chuyên nghiệp", "Phục vụ cả ngày", "Giá cả hợp lý"],
    },
    {
      icon: MapPin,
      title: "Đưa Đón Thành Phố",
      description:
        "Dịch vụ đưa đón trong thành phố tiện lợi và nhanh chóng. Phù hợp cho các chuyến đi ngắn, họp hành, mua sắm hay thăm quan trong thành phố.",
      features: ["Đặt xe theo giờ", "Tài xế am hiểu địa phương", "Xe sạch sẽ, thoải mái", "Giá cả minh bạch"],
    },
    {
      icon: Shield,
      title: "Đưa Đón Sân Bay",
      description:
        "Dịch vụ đưa đón sân bay chuyên nghiệp 24/7. Chúng tôi đảm bảo đưa bạn đến sân bay đúng giờ và đón bạn ngay khi máy bay hạ cánh.",
      features: ["Phục vụ 24/7", "Theo dõi chuyến bay", "Đón tận cửa", "Hỗ trợ hành lý"],
    },
    {
      icon: Globe,
      title: "Tour Toàn Thành Phố",
      description:
        "Khám phá toàn bộ thành phố với dịch vụ tour của chúng tôi. Tài xế kiêm hướng dẫn viên sẽ đưa bạn đến những địa điểm nổi tiếng nhất.",
      features: ["Hướng dẫn viên chuyên nghiệp", "Lịch trình linh hoạt", "Xe có điều hòa", "Giá tour trọn gói"],
    },
    {
      icon: Car,
      title: "Thuê Xe Tự Lái",
      description:
        "Dịch vụ cho thuê xe tự lái với đa dạng các loại xe từ phổ thông đến cao cấp. Thủ tục đơn giản, xe được bảo dưỡng định kỳ.",
      features: ["Đa dạng loại xe", "Thủ tục nhanh gọn", "Bảo hiểm toàn diện", "Hỗ trợ 24/7"],
    },
    {
      icon: Users,
      title: "Thuê Xe Có Tài Xế",
      description:
        "Dịch vụ thuê xe có tài xế chuyên nghiệp, am hiểu địa phương. Phù hợp cho khách du lịch, công tác hay các sự kiện quan trọng.",
      features: ["Tài xế kinh nghiệm", "Xe đời mới", "Phục vụ tận tình", "Giá cả cạnh tranh"],
    },
    {
      icon: Wrench,
      title: "Bảo Dưỡng & Sửa Chữa",
      description:
        "Dịch vụ bảo dưỡng và sửa chữa xe chuyên nghiệp. Đội ngũ kỹ thuật viên giàu kinh nghiệm với trang thiết bị hiện đại.",
      features: ["Kỹ thuật viên chuyên nghiệp", "Phụ tùng chính hãng", "Bảo hành dài hạn", "Giá cả hợp lý"],
    },
    {
      icon: Clock,
      title: "Dịch Vụ Khẩn Cấp",
      description:
        "Hỗ trợ khẩn cấp 24/7 khi xe gặp sự cố. Chúng tôi có đội ngũ kỹ thuật sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.",
      features: ["Hỗ trợ 24/7", "Đội cứu hộ chuyên nghiệp", "Thời gian phản hồi nhanh", "Miễn phí trong bán kính 50km"],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section với ảnh nền */}
      <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/car-service-hero-background.jpg')",
          backgroundColor: "#0c4a6e", // fallback color
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 to-sky-700/80"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Dịch Vụ Của Chúng Tôi</h1>
          <p className="text-sky-100 text-lg max-w-2xl mx-auto drop-shadow-md">
            Chúng tôi cung cấp đa dạng các dịch vụ cho thuê xe chuyên nghiệp, đáp ứng mọi nhu cầu di chuyển của bạn
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-sky-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sky-500 font-medium">Dịch vụ</span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">Dịch Vụ Mới Nhất Của Chúng Tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Với hơn 10 năm kinh nghiệm, chúng tôi tự hào mang đến những dịch vụ cho thuê xe tốt nhất với chất lượng và
              giá cả hợp lý
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card
                  key={index}
                  className="bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 border-sky-100"
                >
                  <CardContent className="p-6 text-center">
                    <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-sky-200 transition-colors">
                      <IconComponent className="h-10 w-10 text-sky-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center justify-center">
                          <span className="w-2 h-2 bg-sky-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
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
              <span className="text-sky-500 font-medium">Tại sao chọn chúng tôi</span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-6">Cam Kết Chất Lượng Hàng Đầu</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-100 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">An Toàn Tuyệt Đối</h4>
                    <p className="text-gray-600">Tất cả xe được bảo dưỡng định kỳ và có bảo hiểm toàn diện</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Phục Vụ 24/7</h4>
                    <p className="text-gray-600">Hỗ trợ khách hàng mọi lúc mọi nơi, kể cả ngày lễ</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Đội Ngũ Chuyên Nghiệp</h4>
                    <p className="text-gray-600">Tài xế và nhân viên được đào tạo bài bản, kinh nghiệm lâu năm</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="h-96 bg-cover bg-center rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ backgroundImage: "url('/professional-car-service-team.jpg')" }}
            ></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/car-rental-cta-background.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/90 to-sky-600/90"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Sẵn Sàng Trải Nghiệm Dịch Vụ?</h2>
          <p className="text-sky-100 text-lg mb-8 max-w-2xl mx-auto drop-shadow-md">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn và đặt xe với giá tốt nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars">
              <Button
                size="lg"
                className="bg-white text-sky-600 hover:bg-gray-100 px-8 hover:scale-105 transition-all duration-300"
              >
                Xem Danh Sách Xe
              </Button>
            </Link>
            <Link href="/contact">
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
