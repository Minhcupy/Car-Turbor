"use client"

import { Car, Users, Shield, Award, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const teamMembers = [
  {
    name: "Nguyễn Văn A",
    position: "Giám đốc điều hành",
    image: "/team-member-1.jpg",
    description: "Hơn 15 năm kinh nghiệm trong ngành dịch vụ ô tô",
  },
  {
    name: "Trần Thị B",
    position: "Trưởng phòng kinh doanh",
    image: "/team-member-2.jpg",
    description: "Chuyên gia tư vấn và chăm sóc khách hàng",
  },
  {
    name: "Lê Văn C",
    position: "Trưởng phòng kỹ thuật",
    image: "/team-member-3.jpg",
    description: "Đảm bảo chất lượng và an toàn của đội xe",
  },
]

const achievements = [
  { number: "10+", label: "Năm kinh nghiệm" },
  { number: "500+", label: "Xe trong đội" },
  { number: "10,000+", label: "Khách hàng hài lòng" },
  { number: "50+", label: "Đối tác tin cậy" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-sky-500" />
              <span className="text-2xl font-bold text-gray-800">CarRental</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-sky-500 transition-colors">
                Trang Chủ
              </Link>
              <Link href="/about" className="text-sky-500 font-medium">
                Giới Thiệu
              </Link>
              <Link href="/cars" className="text-gray-700 hover:text-sky-500 transition-colors">
                Xe Cho Thuê
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-sky-500 transition-colors">
                Liên Hệ
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent">
                  Đăng Nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-sky-500 hover:bg-sky-600 text-white">Đăng Ký</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-sky-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-balance">
              Về CarRental - Đối Tác Tin Cậy Của Bạn
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Với hơn 10 năm kinh nghiệm trong ngành cho thuê xe, chúng tôi cam kết mang đến dịch vụ tốt nhất với đội xe
              đa dạng, chất lượng cao và đội ngũ chuyên nghiệp.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Câu Chuyện Của Chúng Tôi</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  CarRental được thành lập vào năm 2014 với mục tiêu đơn giản: cung cấp dịch vụ cho thuê xe chất lượng
                  cao, đáng tin cậy và giá cả hợp lý cho mọi người.
                </p>
                <p>
                  Bắt đầu với chỉ 10 chiếc xe, chúng tôi đã không ngừng phát triển và hiện tại sở hữu hơn 500 xe các
                  loại, từ xe phổ thông đến xe sang trọng, phục vụ đa dạng nhu cầu của khách hàng.
                </p>
                <p>
                  Chúng tôi tự hào là một trong những công ty cho thuê xe hàng đầu tại Việt Nam, với hơn 10,000 khách
                  hàng đã tin tương và sử dụng dịch vụ của chúng tôi.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/about-story-image.jpg"
                alt="Câu chuyện CarRental"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-sky-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Thành Tựu Của Chúng Tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những con số ấn tượng chứng minh cho sự tin cậy và chất lượng dịch vụ của CarRental
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-8 shadow-sm border border-sky-100">
                  <div className="text-4xl font-bold text-sky-500 mb-2">{achievement.number}</div>
                  <div className="text-gray-600">{achievement.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Giá Trị Cốt Lõi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Những giá trị định hướng mọi hoạt động của chúng tôi</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-sky-100 text-center">
              <CardContent className="p-8">
                <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">An Toàn</h3>
                <p className="text-gray-600">
                  Đảm bảo an toàn tuyệt đối cho khách hàng với xe được kiểm tra định kỳ và bảo hiểm toàn diện.
                </p>
              </CardContent>
            </Card>
            <Card className="border-sky-100 text-center">
              <CardContent className="p-8">
                <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Tận Tâm</h3>
                <p className="text-gray-600">
                  Đặt khách hàng làm trung tâm, luôn lắng nghe và đáp ứng mọi nhu cầu một cách tốt nhất.
                </p>
              </CardContent>
            </Card>
            <Card className="border-sky-100 text-center">
              <CardContent className="p-8">
                <div className="bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Chất Lượng</h3>
                <p className="text-gray-600">
                  Cam kết cung cấp dịch vụ chất lượng cao với đội xe hiện đại và đội ngũ chuyên nghiệp.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Đội Ngũ Lãnh Đạo</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Những người dẫn dắt CarRental hướng tới thành công</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-sky-100 text-center">
                <CardContent className="p-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-sky-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-sky-500 to-sky-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Sẵn Sàng Trải Nghiệm Dịch Vụ?</h2>
          <p className="text-sky-100 text-lg mb-8 max-w-2xl mx-auto">
            Hãy để CarRental đồng hành cùng bạn trong mọi chuyến đi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars">
              <Button size="lg" className="bg-white text-sky-600 hover:bg-gray-100 px-8">
                Đặt Xe Ngay
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 bg-transparent"
              >
                Liên Hệ Tư Vấn
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-8 w-8 text-sky-400" />
                <span className="text-2xl font-bold">CarRental</span>
              </div>
              <p className="text-gray-400 mb-4">Dịch vụ cho thuê xe hàng đầu Việt Nam với hơn 10 năm kinh nghiệm</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Dịch Vụ</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Thuê xe tự lái
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Thuê xe có tài xế
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Xe cưới
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Xe du lịch
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hỗ Trợ</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Chính sách
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Điều khoản
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-sky-400 transition-colors">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>0123 456 789</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@carrental.vn</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CarRental. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
