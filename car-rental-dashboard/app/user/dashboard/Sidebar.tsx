"use client"

import { User, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
    const pathname = usePathname()

    const menu = [
        { href: "/user/dashboard/profile", label: "Tài khoản của tôi", icon: <User className="h-5 w-5 mr-2" /> },
        { href: "/user/dashboard/bookings", label: "Đơn hàng của tôi", icon: <Calendar className="h-5 w-5 mr-2" /> },
        { href: "/user/dashboard/messages", label: "Tin nhắn", icon: <MessageSquare className="h-5 w-5 mr-2" /> },
    ]

    return (
        <aside className="bg-white rounded-xl shadow-sm p-4 space-y-1">
            {menu.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-md font-medium ${pathname === item.href
                        ? "bg-gray-50 text-gray-900 border-l-4 border-green-600"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    {item.icon}
                    {item.label}
                </Link>
            ))}
        </aside>
    )
}
