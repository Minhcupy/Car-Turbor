"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { enrollFace } from "@/src/services/user/faceApi"

export default function FaceRegisterPage() {
    const router = useRouter()
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [stream, setStream] = useState<MediaStream | null>(null)
    const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("")

    // bật camera
    useEffect(() => {
        let active = true

        ;(async () => {
            try {
                const s = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" },
                    audio: false,
                })
                if (!active) {
                    s.getTracks().forEach((t) => t.stop())
                    return
                }
                setStream(s)
                if (videoRef.current) videoRef.current.srcObject = s
            } catch (e) {
                setError("Không thể truy cập camera. Vui lòng cấp quyền camera.")
            }
        })()

        return () => {
            active = false
            setStream((prev) => {
                prev?.getTracks().forEach((t) => t.stop())
                return null
            })
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // tạo previewUrl khi có blob
    useEffect(() => {
        if (!capturedBlob) {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
            setPreviewUrl("")
            return
        }
        const url = URL.createObjectURL(capturedBlob)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [capturedBlob])

    const capture = () => {
        setError("")
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        // đảm bảo video đã load metadata
        const w = video.videoWidth || 640
        const h = video.videoHeight || 480

        canvas.width = w
        canvas.height = h

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.drawImage(video, 0, 0, w, h)

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    setError("Chụp ảnh thất bại, vui lòng thử lại.")
                    return
                }
                setCapturedBlob(blob)
            },
            "image/jpeg",
            0.92
        )
    }

    const retake = () => {
        setError("")
        setCapturedBlob(null)
    }

    const submitEnroll = async () => {
        if (!capturedBlob) return
        setLoading(true)
        setError("")

        try {
            const file = new File([capturedBlob], "face.jpg", { type: "image/jpeg" })
            await enrollFace(file)
            router.replace("/user") // ✅ về trang home chomeủa user
        } catch (e: any) {
            // nếu BE trả error json, axios sẽ nằm ở e.response.data
            const msg =
                e?.response?.data?.message ||
                e?.message ||
                "Đăng ký khuôn mặt thất bại."
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const skip = () => router.replace("/user")

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="p-6 border rounded-xl w-full max-w-md space-y-4">
                <div>
                    <h1 className="text-xl font-semibold mb-1">Đăng ký khuôn mặt</h1>
                    <p className="text-gray-600">
                        Bạn cần đăng ký khuôn mặt trước khi vào trang Home.
                    </p>
                </div>

                {/* Camera / Preview */}
                {!capturedBlob ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full rounded-lg bg-black"
                    />
                ) : (
                    <img
                        src={previewUrl}
                        alt="Captured"
                        className="w-full rounded-lg"
                    />
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                {/* Buttons */}
                {!capturedBlob ? (
                    <Button className="w-full" onClick={capture} disabled={!stream}>
                        Chụp ảnh
                    </Button>
                ) : (
                    <div className="space-y-2">
                        <Button className="w-full" onClick={submitEnroll} disabled={loading}>
                            {loading ? "Đang đăng ký..." : "Xác nhận đăng ký"}
                        </Button>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={retake}
                            disabled={loading}
                        >
                            Chụp lại
                        </Button>
                    </div>
                )}

                <Button
                    className="w-full"
                    variant="secondary"
                    onClick={skip}
                    disabled={loading}
                >
                    (Tạm) Bỏ qua
                </Button>

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    )
}
