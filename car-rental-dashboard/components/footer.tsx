"use client"

import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react"
import FloatingChatbot from "./FloatingChatbot"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        {/* Grid chính */}
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo + mô tả */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">
              Car<span className="text-sky-400">book</span>
            </h2>
            <p className="mb-6 text-sm leading-relaxed">
              Nền tảng thuê xe hiện đại, nhanh chóng và tiện lợi. Giúp bạn dễ dàng
              kết nối, di chuyển mọi nơi với trải nghiệm tuyệt vời.
            </p>
            {/* Social icons */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center hover:bg-sky-600 transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center hover:bg-sky-600 transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Thông tin */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Thông Tin</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link href="/user/services" className="hover:text-sky-400 transition-colors">
                  Dịch Vụ
                </Link>
              </li>
              <li>
                <Link href="/user/pricing" className="hover:text-sky-400 transition-colors">
                  Bảng Giá
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">
                  Bảo Đảm Giá Tốt
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">
                  Chính Sách Bảo Mật
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">
                  Tùy Chọn Thanh Toán
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">
                  Mẹo Đặt Xe
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">
                  Cách Hoạt Động
                </a>
              </li>
              <li>
                <Link href="/user/contact" className="hover:text-sky-400 transition-colors">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Có Câu Hỏi?</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-sky-400 mt-1" />
                <span>Ngõ 94, Hồ Tùng Mậu,Phú Diễn ,Hà Nội</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-sky-400" />
                <span>0379389761</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-sky-400" />
                <span>Baotuan2k4bt@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">
            © 2025 Carbook. All rights reserved. | Made with ❤️ by Colorlib
          </p>
          <form className="mt-4 md:mt-0 flex">
            <input
              type="email"
              placeholder="Nhập email để nhận tin khuyến mãi..."
              className="px-4 py-2 rounded-l-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 rounded-r-md text-white hover:bg-sky-600 transition-colors text-sm font-semibold"
            >
              Đăng Ký
            </button>
          </form>
        </div>
      </div>
      <FloatingChatbot />
    </footer>
  )
}
