"use client"

import { useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function VnpayReturnPage() {
    const sp = useSearchParams()
    const router = useRouter()

    const bookingId = sp.get("bookingId")
    const code = sp.get("code")
    const ok = sp.get("ok") === "true"

    const success = useMemo(() => ok && code === "00", [ok, code])

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
            <div
                className={`w-full max-w-md rounded-2xl border p-6 shadow-sm ${
                    success ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
                }`}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-xl ${
                            success ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                        }`}
                        aria-hidden
                    >
                        {success ? "✓" : "!"}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-gray-900">
                            {success ? "Thanh toán thành công" : "Thanh toán thất bại"}
                        </h1>

                        <p className="mt-1 text-sm text-gray-700">
                            {success
                                ? "Giao dịch đã được ghi nhận. Bạn có thể quay lại để xem chi tiết đơn."
                                : "Giao dịch chưa thành công hoặc không được xác thực. Vui lòng thử lại."}
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-xl bg-white/70 border p-3 text-sm text-gray-800 space-y-1">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Mã đơn</span>
                        <b>{bookingId ?? "-"}</b>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Mã phản hồi</span>
                        <b>{code ?? "-"}</b>
                    </div>
                </div>

                <div className="mt-5 flex gap-2">
                    <button
                        className="flex-1 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold"
                        onClick={() => router.push("/user")}
                    >
                        Về trang chủ
                    </button>

                    {!success && bookingId && (
                        <button
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold"
                            onClick={() => router.push(`/user/bookings/${bookingId}`)}
                        >
                            Xem đơn
                        </button>
                    )}
                </div>

                <p className="mt-3 text-xs text-gray-500">
                    * Trạng thái cuối cùng được xác nhận bởi hệ thống (IPN). Nếu vừa thanh toán xong mà chưa cập nhật, hãy chờ vài giây và tải lại.
                </p>
            </div>
        </div>
    )
}