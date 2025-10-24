"use client"

import { Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RequireLogin() {
    const router = useRouter()

    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center border border-sky-100">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mx-auto mb-6">
                    <Lock className="w-8 h-8 text-sky-600" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    Bạn cần đăng nhập để đặt xe
                </h1>

                {/* Subtitle */}
                <p className="text-gray-600 mb-8">
                    Vui lòng đăng nhập để tiếp tục quy trình đặt xe 4 bước.
                    Nếu chưa có tài khoản, bạn có thể đăng ký miễn phí ngay.
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push("/user/login")}
                        className="w-full px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-sm transition"
                    >
                        🔑 Đăng nhập ngay
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium transition"
                    >
                        ⬅️ Quay lại trang chủ
                    </button>
                </div>
            </div>
        </div>
    )
}
