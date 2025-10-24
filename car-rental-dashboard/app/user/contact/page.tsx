"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", formData)
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.")
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section với ảnh nền */}
      <section
        className="py-16 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('/contact-us-hero-background.jpg')",
          backgroundColor: "#f0f9ff", // fallback color
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sky-50/90 to-white/90"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-balance drop-shadow-sm">Liên Hệ Với Chúng Tôi</h1>
            <p className="text-xl text-gray-600 leading-relaxed drop-shadow-sm">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ để được tư vấn và đặt xe nhanh chóng!
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-sky-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-sky-500" />
                  <span>Thông Tin Liên Hệ</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Địa chỉ</h3>
                    <p className="text-gray-600">123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Điện thoại</h3>
                    <p className="text-gray-600">Hotline: 0123 456 789</p>
                    <p className="text-gray-600">Zalo: 0987 654 321</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">info@carrental.vn</p>
                    <p className="text-gray-600">support@carrental.vn</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Giờ làm việc</h3>
                    <p className="text-gray-600">Thứ 2 - Chủ nhật: 6:00 - 22:00</p>
                    <p className="text-gray-600">Hỗ trợ khẩn cấp: 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="border-sky-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-gray-800">Liên Hệ Nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white hover:scale-105 transition-all duration-300">
                  <Phone className="h-4 w-4 mr-2" />
                  Gọi Ngay: 0123 456 789
                </Button>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 transition-all duration-300">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat Zalo
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent hover:scale-105 transition-all duration-300"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-sky-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-gray-800">Gửi Tin Nhắn Cho Chúng Tôi</CardTitle>
                <p className="text-gray-600">Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại trong vòng 24h</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input
                        id="name"
                        placeholder="Nhập họ và tên của bạn"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="border-sky-200 focus:border-sky-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="border-sky-200 focus:border-sky-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="border-sky-200 focus:border-sky-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Chủ đề</Label>
                      <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                        <SelectTrigger className="border-sky-200">
                          <SelectValue placeholder="Chọn chủ đề" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Đặt xe</SelectItem>
                          <SelectItem value="support">Hỗ trợ kỹ thuật</SelectItem>
                          <SelectItem value="complaint">Khiếu nại</SelectItem>
                          <SelectItem value="partnership">Hợp tác</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Tin nhắn *</Label>
                    <Textarea
                      id="message"
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="border-sky-200 focus:border-sky-500 min-h-32"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white hover:scale-105 transition-all duration-300"
                    disabled={!formData.name || !formData.email || !formData.phone || !formData.message}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Gửi Tin Nhắn
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <Card className="border-sky-100 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-gray-800">Vị Trí Của Chúng Tôi</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className="w-full h-96 bg-cover bg-center rounded-b-lg flex items-center justify-center relative"
                style={{ backgroundImage: "url('/office-location-map-placeholder.jpg')" }}
              >
                <div className="absolute inset-0 bg-gray-900/50 rounded-b-lg"></div>
                <div className="relative z-10 text-center text-white">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-lg font-semibold">Văn phòng chính</p>
                  <p className="text-sm">123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <Card className="border-sky-100 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-gray-800">Câu Hỏi Thường Gặp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Làm thế nào để đặt xe?</h3>
                <p className="text-gray-600">
                  Bạn có thể đặt xe trực tuyến qua website, gọi hotline 0123 456 789, hoặc nhắn tin Zalo. Chúng tôi sẽ
                  xác nhận và giao xe theo yêu cầu.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Cần giấy tờ gì để thuê xe?</h3>
                <p className="text-gray-600">
                  Bạn cần có GPLX hạng B2 trở lên, CCCD/CMND, và đặt cọc theo quy định. Chúng tôi sẽ hướng dẫn chi tiết
                  khi bạn liên hệ.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Có hỗ trợ giao xe tận nơi không?</h3>
                <p className="text-gray-600">
                  Có, chúng tôi hỗ trợ giao xe tận nơi trong nội thành TP.HCM. Phí giao xe sẽ được tính theo khoảng cách
                  và thời gian.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
