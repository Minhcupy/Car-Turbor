"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Eye, EyeOff, Car, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {signinSendOtp, verifyOtp} from "@/src/services/user/auth"
import { setTokens } from "@/src/services/user/token"
import { checkFaceEnrolled } from "@/src/services/user/faceApi"

type Step = "CREDENTIALS" | "OTP"

interface LoginForm {
  userName: string
  password: string
}

export default function LoginPage() {
  const [step, setStep] = useState<Step>("CREDENTIALS")

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginForm>({ userName: "", password: "" })

  const [otp, setOtp] = useState("")
  const [otpToken, setOtpToken] = useState("")
  const [maskedEmail, setMaskedEmail] = useState("")
  const [expiresIn, setExpiresIn] = useState<number>(0)

  const [errors, setErrors] = useState<{ userName?: string; password?: string; otp?: string; general?: string; success?: string }>({})
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const validateCredentials = () => {
    const newErrors: typeof errors = {}
    if (!formData.userName.trim()) newErrors.userName = "Tên đăng nhập không được để trống"
    else if (formData.userName.length < 4) newErrors.userName = "Tên đăng nhập phải ít nhất 4 ký tự"

    if (!formData.password.trim()) newErrors.password = "Mật khẩu không được để trống"
    else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải ít nhất 6 ký tự"
    return newErrors
  }

  const validateOtp = () => {
    const newErrors: typeof errors = {}
    if (!otp.trim()) newErrors.otp = "Vui lòng nhập OTP"
    else if (!/^\d{6}$/.test(otp.trim())) newErrors.otp = "OTP phải gồm 6 chữ số"
    return newErrors
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateCredentials()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)
    try {
      // 1) signin -> send otp
      const res = await signinSendOtp(formData.userName, formData.password)
      // res: { requiresOtp, otpToken, expiresIn, maskedEmail }
      setOtpToken(res.otpToken)
      setMaskedEmail(res.maskedEmail || "")
      setExpiresIn(res.expiresIn || 300)

      setStep("OTP")
      setErrors({ success: `Đã gửi OTP tới ${res.maskedEmail || "email của bạn"}` })
    } catch (error: any) {
      setErrors({ general: error?.response?.data?.message || error?.message || "Tên đăng nhập hoặc mật khẩu không đúng" })
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateOtp()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)
    try {
      // 2) verify otp -> get jwt
      const res = await verifyOtp(otpToken, otp.trim())
      const { accessToken, refreshToken, roles, userName, id } = res

      // save tokens
      setTokens(accessToken, refreshToken)

      localStorage.setItem("userId", String(id))
      const role = roles && roles.length > 0 ? roles[0].replace("ROLE_", "") : ""
      localStorage.setItem("userRole", role)
      localStorage.setItem("userName", userName || "")

      setErrors({ success: "Xác thực OTP thành công! Đang chuyển hướng..." })

      // redirect by role
      if (role === "ADMIN") {
        router.replace("/admin")
        return
      }

      // check face enrolled (protected)
      try {
        const resp = await checkFaceEnrolled()
        const registered = (resp as any)?.registered
        const enrolled = (resp as any)?.enrolled
        const ok = typeof registered === "boolean" ? registered : !!enrolled

        if (!ok) router.replace("/user/face-register")
        else router.replace("/user")
      } catch (err: any) {
        console.log("checkFaceEnrolled error:", err?.response?.status, err?.response?.data || err?.message)
        router.replace("/user/face-register")
      }
    } catch (error: any) {
      setErrors({ otp: "OTP không đúng hoặc đã hết hạn" })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
                  {step === "OTP" ? <Mail className="h-8 w-8 text-sky-500" /> : <Car className="h-8 w-8 text-sky-500" />}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {step === "OTP" ? "Nhập OTP" : "Đăng Nhập"}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {step === "OTP"
                    ? `Mã đã gửi tới ${maskedEmail || "email của bạn"}`
                    : "Chào mừng bạn trở lại!"}
              </p>
            </CardHeader>

            <CardContent>
              {step === "CREDENTIALS" ? (
                  <form onSubmit={handleCredentialsSubmit} className="space-y-4">
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
                      {loading ? "Đang gửi OTP..." : "Tiếp tục"}
                    </Button>
                  </form>
              ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-gray-700">Mã OTP (6 số)</Label>
                      <Input
                          id="otp"
                          name="otp"
                          inputMode="numeric"
                          placeholder="Nhập OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className={`border ${errors.otp ? "border-red-500" : "border-sky-200"} focus:border-sky-500`}
                      />
                      {errors.otp && <p className="text-sm text-red-500">{errors.otp}</p>}
                    </div>

                    {errors.general && <p className="text-sm text-red-600 text-center">{errors.general}</p>}
                    {errors.success && <p className="text-sm text-green-600 text-center">{errors.success}</p>}

                    <div className="flex gap-2">
                      <Button
                          type="button"
                          variant="outline"
                          className="w-1/3"
                          onClick={() => {
                            setStep("CREDENTIALS")
                            setOtp("")
                            setErrors({})
                          }}
                          disabled={loading}
                      >
                        Quay lại
                      </Button>
                      <Button type="submit" disabled={loading} className="w-2/3 bg-sky-500 hover:bg-sky-600 text-white">
                        {loading ? "Đang xác thực..." : "Xác nhận"}
                      </Button>
                    </div>
                  </form>
              )}

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
