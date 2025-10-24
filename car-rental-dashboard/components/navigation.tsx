// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Car, User, Settings, LogOut, ChevronDown } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu"
// import { useToast } from "@/components/ui/use-toast"

// // Service gọi BE
// import { getCurrentUser, UserInfo } from "@/src/services/user/user"
// import { clearTokens, getAccessToken } from "@/src/services/user/token"

// export default function Navigation() {
//   const [user, setUser] = useState<UserInfo | null>(null)
//   const { toast } = useToast()
//   const router = useRouter()

//   // Khi mount → kiểm tra token & lấy user
//   useEffect(() => {
//     const token = getAccessToken()
//     if (token) {
//       getCurrentUser()
//         .then(setUser)
//         .catch(() => {
//           clearTokens()
//           setUser(null)
//         })
//     }
//   }, [])

//   // Xử lý logout
//   const handleLogout = () => {
//     clearTokens()
//     setUser(null)

//     toast({
//       title: "Đăng xuất thành công",
//       description: "Hẹn gặp lại bạn lần sau 👋",
//       duration: 2000,
//     })

//     setTimeout(() => {
//       router.replace("/user/login")
//     }, 1500)
//   }

//   return (
//     <header className="bg-white shadow-sm border-b border-sky-100">
//       <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//         {/* Logo */}
//         <Link href="/user" className="flex items-center space-x-2">
//           <Car className="h-8 w-8 text-sky-500" />
//           <span className="text-2xl font-bold text-gray-800">CarRental</span>
//         </Link>

//         {/* Menu */}
//         <nav className="flex items-center space-x-6">
//           <Link href="/user" className="hover:text-sky-500">Trang Chủ</Link>
//           <Link href="/user/cars" className="hover:text-sky-500">Xe Cho Thuê</Link>
//           <Link href="/user/contact" className="hover:text-sky-500">Liên Hệ</Link>
//         </nav>

//         {/* Auth Section */}
//         {user ? (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
//                 <Avatar className="w-8 h-8">
//                   <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.userName} />
//                   <AvatarFallback>
//                     {user.userName?.charAt(0).toUpperCase() || "U"}
//                   </AvatarFallback>
//                 </Avatar>
//                 <span className="text-gray-800">{user.userName}</span>
//                 <ChevronDown className="h-4 w-4 text-gray-500" />
//               </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent align="end" className="w-48">
//               <div className="px-3 py-2 border-b">
//                 <p className="text-sm font-medium text-gray-900">{user.userName}</p>
//                 <p className="text-xs text-gray-500">{user.userEmail}</p>
//               </div>

//               <DropdownMenuItem asChild>
//                 <Link href="/user/profile" className="flex items-center space-x-2">
//                   <User className="h-4 w-4" />
//                   <span>Thông tin cá nhân</span>
//                 </Link>
//               </DropdownMenuItem>

//               <DropdownMenuItem asChild>
//                 <Link href="/user/settings" className="flex items-center space-x-2">
//                   <Settings className="h-4 w-4" />
//                   <span>Cài đặt</span>
//                 </Link>
//               </DropdownMenuItem>

//               <DropdownMenuSeparator />

//               <DropdownMenuItem
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 text-red-600 cursor-pointer"
//               >
//                 <LogOut className="h-4 w-4" />
//                 <span>Đăng xuất</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         ) : (
//           <div className="flex items-center space-x-4">
//             <Link href="/user/login">
//               <Button variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50">
//                 Đăng Nhập
//               </Button>
//             </Link>
//             <Link href="/user/register">
//               <Button className="bg-sky-500 text-white hover:bg-sky-600">Đăng Ký</Button>
//             </Link>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }
