"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Car, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Services
import { login } from "@/src/services/user/auth"
import { setTokens } from "@/src/services/user/token"
import { checkFaceEnrolled } from "@/src/services/user/faceApi"

interface LoginForm {
  userName: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginForm>({
    userName: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ userName?: string; password?: string; general?: string; success?: string }>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!formData.userName.trim()) newErrors.userName = "Tên đăng nhập không được để trống"
    else if (formData.userName.length < 4) newErrors.userName = "Tên đăng nhập phải ít nhất 4 ký tự"

    if (!formData.password.trim()) newErrors.password = "Mật khẩu không được để trống"
    else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải ít nhất 6 ký tự"

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      // 1) Login
      const res = await login(formData.userName, formData.password)
      const { accessToken, refreshToken, roles, userName, id } = res

      // 2) Save tokens BEFORE calling any protected API
      setTokens(accessToken, refreshToken)

      localStorage.setItem("userId", String(id))
      const role = roles && roles.length > 0 ? roles[0].replace("ROLE_", "") : ""
      localStorage.setItem("userRole", role)
      localStorage.setItem("userName", userName || "")

      setErrors({ success: "Đăng nhập thành công! Đang chuyển hướng..." })

      // 3) Redirect by role
      if (role === "ADMIN") {
        router.replace("/admin")
        return
      }

      // 4) Check face enrolled (must succeed with token)
      try {
        const resp = await checkFaceEnrolled()

        // nếu backend trả {registered: boolean}
        const registered = (resp as any)?.registered

        // nếu backend trả {enrolled: boolean} (phòng trường hợp sai field)
        const enrolled = (resp as any)?.enrolled

        const ok = typeof registered === "boolean" ? registered : !!enrolled

        if (!ok) router.replace("/user/face-register")
        else router.replace("/user")
      } catch (err: any) {
        // Quan trọng: nếu check bị 401/403 -> đừng âm thầm đá về /user, hãy cho biết để debug
        console.log("checkFaceEnrolled error:", err?.response?.status, err?.response?.data || err?.message)
        // fallback: cho vào trang đăng ký face luôn để user không bị kẹt
        router.replace("/user/face-register")
      }
    } catch (error: any) {
      setErrors({ general: error?.message || "Tên đăng nhập hoặc mật khẩu không đúng" })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href="/user" className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 transition-colors">
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
              <CardTitle className="text-2xl font-bold text-gray-800">Đăng Nhập</CardTitle>
              <p className="text-gray-600 mt-2">Chào mừng bạn trở lại!</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-gray-700">Tên đăng nhập</Label>
                  <Input
                      id="userName"
                      name="userName"
                      type="text"
                      placeholder="Nhập tên đăng nhập"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className={`border ${errors.userName ? "border-red-500" : "border-sky-200"} focus:border-sky-500`}
                  />
                  {errors.userName && <p className="text-sm text-red-500">{errors.userName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`border ${errors.password ? "border-red-500" : "border-sky-200"} focus:border-sky-500 pr-10`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                {errors.general && <p className="text-sm text-red-600 text-center">{errors.general}</p>}
                {errors.success && <p className="text-sm text-green-600 text-center">{errors.success}</p>}

                <Button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                  {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Chưa có tài khoản?{" "}
                  <Link href="/user/register" className="text-sky-600 hover:text-sky-700 font-medium">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
