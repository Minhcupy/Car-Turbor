"use client"

import { useState } from "react"
import { Eye, EyeOff, Car, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Services
import { register, checkEmailExists } from "@/src/services/user/auth"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [emailChecking, setEmailChecking] = useState(false)
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: "",
    userFullName: "",
    userPhone: "",
    agreeTerms: false,
  })
  const router = useRouter()

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.userName.trim()) newErrors.userName = "Tên đăng nhập không được để trống"
    else if (formData.userName.length < 4) newErrors.userName = "Tên đăng nhập tối thiểu 4 ký tự"

    if (!formData.userFullName.trim()) newErrors.userFullName = "Họ và tên không được để trống"

    if (!formData.userEmail.trim()) newErrors.userEmail = "Email không được để trống"
    else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) newErrors.userEmail = "Email không hợp lệ"

    if (!formData.userPhone.trim()) newErrors.userPhone = "Số điện thoại không được để trống"
    else if (!/^[0-9]{9,11}$/.test(formData.userPhone)) newErrors.userPhone = "Số điện thoại phải từ 9-11 số"

    if (!formData.userPassword) newErrors.userPassword = "Mật khẩu không được để trống"
    else if (formData.userPassword.length < 6) newErrors.userPassword = "Mật khẩu tối thiểu 6 ký tự"

    if (formData.userPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"

    if (!formData.agreeTerms) newErrors.agreeTerms = "Bạn phải đồng ý với điều khoản sử dụng"

    setErrors(prev => ({ ...prev, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }

  // Check email khi blur
  const handleEmailBlur = async () => {
    const email = formData.userEmail.trim()
    if (!email || errors.userEmail) return
    setEmailChecking(true)
    const exists = await checkEmailExists(email)
    setEmailChecking(false)
    if (exists) {
      setErrors(prev => ({ ...prev, userEmail: "Email đã được sử dụng" }))
    } else {
      // nếu trước đó có lỗi "đã tồn tại" thì clear
      if (errors.userEmail === "Email đã được sử dụng") {
        const { userEmail, ...rest } = errors
        setErrors(rest)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // kiểm tra tồn tại một lần nữa trước khi gọi register
    const exists = await checkEmailExists(formData.userEmail.trim())
    if (exists) {
      setErrors(prev => ({ ...prev, userEmail: "Email đã được sử dụng" }))
      return
    }

    try {
      await register({
        userName: formData.userName,
        password: formData.userPassword,
        email: formData.userEmail,
        userFullName: formData.userFullName,
        userPhone: formData.userPhone,
      })
      alert("Đăng ký thành công! Vui lòng đăng nhập.")
      router.replace("/user/login")
    } catch (err: any) {
      // Nếu BE trả 409/400 với message “Email already in use” thì show ở dưới input
      const msg = err?.response?.data?.message || "Đăng ký thất bại"
      if (msg.toLowerCase().includes("email")) {
        setErrors(prev => ({ ...prev, userEmail: msg }))
      } else {
        alert(msg)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // gõ lại email thì clear lỗi “đã tồn tại”
    if (name === "userEmail" && errors.userEmail === "Email đã được sử dụng") {
      const { userEmail, ...rest } = errors
      setErrors(rest)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Về trang chủ
        </Link>

        <Card className="border-sky-100 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-sky-100 p-3 rounded-full">
                <Car className="h-8 w-8 text-sky-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Đăng Ký</CardTitle>
            <p className="text-gray-600 mt-2">Tạo tài khoản mới để bắt đầu</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              <div className="space-y-1">
                <Label htmlFor="userFullName">Họ và tên</Label>
                <Input
                  id="userFullName"
                  name="userFullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={formData.userFullName}
                  onChange={handleInputChange}
                />
                {errors.userFullName && <p className="text-red-500 text-sm">{errors.userFullName}</p>}
              </div>

              {/* Username */}
              <div className="space-y-1">
                <Label htmlFor="userName">Tên đăng nhập</Label>
                <Input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.userName}
                  onChange={handleInputChange}
                />
                {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  placeholder="Nhập email"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                  onBlur={handleEmailBlur}
                />
                {emailChecking && <p className="text-xs text-gray-500">Đang kiểm tra email...</p>}
                {errors.userEmail && <p className="text-red-500 text-sm">{errors.userEmail}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <Label htmlFor="userPhone">Số điện thoại</Label>
                <Input
                  id="userPhone"
                  name="userPhone"
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={formData.userPhone}
                  onChange={handleInputChange}
                />
                {errors.userPhone && <p className="text-red-500 text-sm">{errors.userPhone}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="userPassword">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="userPassword"
                    name="userPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={formData.userPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.userPassword && <p className="text-red-500 text-sm">{errors.userPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 rounded border-sky-300 text-sky-500 focus:ring-sky-500"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                  Tôi đồng ý với{" "}
                  <Link href="/terms" className="text-sky-600 hover:text-sky-700">
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="text-sky-600 hover:text-sky-700">
                    Chính sách bảo mật
                  </Link>
                </label>
              </div>
              {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}

              <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                Đăng Ký
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{" "}
                <Link href="/user/login" className="text-sky-600 hover:text-sky-700 font-medium">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
