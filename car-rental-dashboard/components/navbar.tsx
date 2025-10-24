"use client"

import Link from "next/link"
import { Car, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/src/context/AuthContext"

export default function Navbar() {
  const { auth, logout, loading } = useAuth()

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/user" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-sky-400" />
            <span className="text-2xl font-bold">
              Car<span className="text-sky-400">Book</span>
            </span>
          </Link>

          {/* Menu */}
          <div className="flex items-center space-x-8">
            <Link href="/user" className="hover:text-sky-400">Trang Chủ</Link>
            <Link href="/user/cars" className="hover:text-sky-400">Xe Cho Thuê</Link>
            <Link href="/user/services" className="hover:text-sky-400">Dịch Vụ</Link>
            <Link href="/user/contact" className="hover:text-sky-400">Liên Hệ</Link>

            {/* Auth Section */}
            <div className="flex items-center space-x-3">
              {loading ? (
                <span className="text-gray-400">Đang tải...</span>
              ) : auth.isLoggedIn ? (
                <>
                  {/* Avatar + Tên */}
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={
                          auth.avatar
                            ? `http://localhost:8080${auth.avatar}` // BE trả về /uploads/xxx.jpg
                            : "/default-avatar.png" // ảnh mặc định khi chưa có avatar
                        }
                        alt={auth.userName}
                      />
                      <AvatarFallback>
                        {auth.userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{auth.userName}</span>
                  </div>

                  {/* Trang cá nhân */}
                  <Link href="/user/dashboard">
                    <Button
                      variant="outline"
                      className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-white"
                    >
                      Trang cá nhân
                    </Button>
                  </Link>

                  {/* Logout */}
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                  </Button>
                </>
              ) : (
                <Link href="/user/login">
                  <Button
                    variant="outline"
                    className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-white"
                  >
                    <User className="h-4 w-4 mr-2" /> Đăng Nhập
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
