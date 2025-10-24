// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Eye, EyeOff, Car, ArrowLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import Link from "next/link"
// import { useRouter } from "next/navigation"

// // Import service
// import { register } from "@/src/services/user/auth"

// export default function RegisterPage() {
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [formData, setFormData] = useState({
//     userName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     agreeTerms: false,
//   })

//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (formData.password !== formData.confirmPassword) {
//       alert("Mật khẩu xác nhận không khớp!")
//       return
//     }
//     if (!formData.agreeTerms) {
//       alert("Vui lòng đồng ý với điều khoản sử dụng!")
//       return
//     }

//     try {
//       await register({
//         userName: formData.userName,
//         userPassword: formData.password,
//         userEmail: formData.email,
//       })

//       alert("Đăng ký thành công!")
//       router.push("/user/login")
//     } catch (err: any) {
//       alert(err?.response?.data?.message || "Đăng ký thất bại")
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     })
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Back to Home */}
//         <Link
//           href="/"
//           className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 transition-colors"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Về trang chủ
//         </Link>

//         <Card className="border-sky-100 shadow-lg">
//           <CardHeader className="text-center pb-6">
//             <div className="flex items-center justify-center mb-4">
//               <div className="bg-sky-100 p-3 rounded-full">
//                 <Car className="h-8 w-8 text-sky-500" />
//               </div>
//             </div>
//             <CardTitle className="text-2xl font-bold text-gray-800">
//               Đăng Ký
//             </CardTitle>
//             <p className="text-gray-600 mt-2">Tạo tài khoản mới để bắt đầu</p>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="userName" className="text-gray-700">
//                   Tên đăng nhập
//                 </Label>
//                 <Input
//                   id="userName"
//                   name="userName"
//                   type="text"
//                   placeholder="Nhập tên đăng nhập"
//                   value={formData.userName}
//                   onChange={handleInputChange}
//                   className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-gray-700">
//                   Email
//                 </Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="Nhập email của bạn"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-gray-700">
//                   Mật khẩu
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Nhập mật khẩu"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className="border-sky-200 focus:border-sky-500 focus:ring-sky-500 pr-10"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword" className="text-gray-700">
//                   Xác nhận mật khẩu
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Nhập lại mật khẩu"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     className="border-sky-200 focus:border-sky-500 focus:ring-sky-500 pr-10"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-2">
//                 <input
//                   type="checkbox"
//                   id="agreeTerms"
//                   name="agreeTerms"
//                   checked={formData.agreeTerms}
//                   onChange={handleInputChange}
//                   className="mt-1 rounded border-sky-300 text-sky-500 focus:ring-sky-500"
//                   required
//                 />
//                 <label htmlFor="agreeTerms" className="text-sm text-gray-600 leading-relaxed">
//                   Tôi đồng ý với{" "}
//                   <Link href="/terms" className="text-sky-600 hover:text-sky-700">
//                     Điều khoản sử dụng
//                   </Link>{" "}
//                   và{" "}
//                   <Link href="/privacy" className="text-sky-600 hover:text-sky-700">
//                     Chính sách bảo mật
//                   </Link>
//                 </label>
//               </div>
//               <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white">
//                 Đăng Ký
//               </Button>
//             </form>
//             <div className="mt-6 text-center">
//               <p className="text-gray-600">
//                 Đã có tài khoản?{" "}
//                 <Link href="/user/login" className="text-sky-600 hover:text-sky-700 font-medium">
//                   Đăng nhập ngay
//                 </Link>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
