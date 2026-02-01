"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Webcam from "react-webcam"
import { ArrowLeft, Download, AlertCircle, FileSignature } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"

import api from "@/src/services/user/api"
import type {
    BookingRequestDTO,
    BookingPreviewDTO,
    BookingResponseDTO,
    CarItem,
} from "@/src/services/user/apiBookingUserService " // ✅ FIX: bỏ dấu cách cuối
import { paymentApi, type PaymentResponseDTO } from "@/src/services/user/paymentApi"
import type { Pricing } from "@/src/services/user/pricingApi"
import { createFaceChallenge, verifyFaceVideo } from "@/src/services/user/faceApi"
import {
    signElectronic,
    signDigital,
    downloadContractPdf,
    type ContractDTO,
} from "@/src/services/user/contractApi"

// ================== Config ==================
const paymentMethods = [
    { key: "SIMULATED", label: "Thanh toán giả lập (Test)" },
    { key: "CASH", label: "Tiền mặt" },
    { key: "MOMO", label: "Ví MoMo" },
    { key: "VNPAY", label: "VNPay" },
    { key: "CREDIT_CARD", label: "Thẻ tín dụng" },
] as const

type PaymentMethod = (typeof paymentMethods)[number]["key"]

const FACE_TOKEN_KEY = "faceVerifiedToken"
const FACE_HEADER = "X-Face-Verified"

// ================== Types ==================
interface Step4PaymentProps {
    selectedCar: CarItem
    formData: any
    preview: BookingPreviewDTO | null
    prevStep: () => void
    selectedPricingId: number | null
    selectedPricing: Pricing | null
}

// ================== Helpers ==================
function unitLabel(unit?: string) {
    switch (unit) {
        case "HOUR":
            return "giờ"
        case "DAY":
            return "ngày"
        case "WEEK":
            return "tuần"
        case "MONTH":
            return "tháng"
        default:
            return "ngày"
    }
}

function money(n: number) {
    return (n ?? 0).toLocaleString("vi-VN")
}

function isValidContractStatus(x: any): x is ContractDTO["status"] {
    return x === "DRAFT" || x === "SIGNED_ELECTRONIC" || x === "SIGNED_DIGITAL" || x === "VOID"
}

function pickRecorderMimeType() {
    // ưu tiên vp8 (ổn định & phổ biến), rồi webm thường
    const candidates = [
        "video/webm;codecs=vp8",
        "video/webm;codecs=vp9",
        "video/webm",
    ]
    for (const t of candidates) {
        if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(t)) return t
    }
    return "" // để browser tự chọn
}

// ================== Component ==================
export default function Step4Payment({
                                         selectedCar,
                                         formData,
                                         preview,
                                         prevStep,
                                         selectedPricingId,
                                         selectedPricing,
                                     }: Step4PaymentProps) {
    const [loading, setLoading] = useState(false)
    const [booking, setBooking] = useState<BookingResponseDTO | null>(null)
    const [payment, setPayment] = useState<PaymentResponseDTO | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("SIMULATED")
    const [agree, setAgree] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // ===== Face Verify State (VIDEO) =====
    const webcamRef = useRef<Webcam>(null)
    const recorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<BlobPart[]>([])
    const stopTimerRef = useRef<number | null>(null)
    const faceVideoUrlRef = useRef<string>("")

    const [challengeId, setChallengeId] = useState<string | null>(null)
    const [steps, setSteps] = useState<string[]>([])
    const [faceVideoBlob, setFaceVideoBlob] = useState<Blob | null>(null)
    const [faceVideoUrl, setFaceVideoUrl] = useState<string>("")
    const [recording, setRecording] = useState(false)

    const [faceToken, setFaceToken] = useState<string | null>(null)
    const [faceStatus, setFaceStatus] = useState<string>("")
    const faceVerified = !!faceToken

    // ===== Contract signing state =====
    const [contractId, setContractId] = useState<number | null>(null)
    const [contractStatus, setContractStatus] = useState<ContractDTO["status"] | "">("")
    const [showContractStep, setShowContractStep] = useState(false)
    const [signing, setSigning] = useState(false)
    const [signedElectronic, setSignedElectronic] = useState(false)
    const [signedDigital, setSignedDigital] = useState(false)

    // ✅ PDF preview via Blob URL (có JWT)
    const [pdfUrl, setPdfUrl] = useState("")
    const [pdfLoading, setPdfLoading] = useState(false)

    // signature canvas
    const sigCanvasRef = useRef<HTMLCanvasElement>(null)
    const [sigEmpty, setSigEmpty] = useState(true)

    // load token when refresh
    useEffect(() => {
        const saved = sessionStorage.getItem(FACE_TOKEN_KEY)
        if (saved) setFaceToken(saved)
    }, [])

    // cleanup on unmount
    useEffect(() => {
        return () => {
            try {
                if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current)
                stopTimerRef.current = null
                if (recorderRef.current && recorderRef.current.state !== "inactive") {
                    recorderRef.current.stop()
                }
            } catch {}

            if (faceVideoUrlRef.current) {
                URL.revokeObjectURL(faceVideoUrlRef.current)
                faceVideoUrlRef.current = ""
            }
        }
    }, [])

    // ===== rentalUnits =====
    const rentalUnits = useMemo(() => {
        const n = Number(formData?.rentalUnits)
        if (!Number.isFinite(n) || n <= 0) return 1
        return Math.floor(n)
    }, [formData?.rentalUnits])

    // ===== calc =====
    const calc = useMemo(() => {
        if (!selectedPricingId || !selectedPricing) return null
        const pricePerUnit = Number(selectedPricing.price ?? 0)
        const total = rentalUnits * pricePerUnit
        const deposit = Math.round(total * 0.3)
        const remain = total - deposit
        return { unitText: unitLabel(selectedPricing.unit), units: rentalUnits, pricePerUnit, total, deposit, remain }
    }, [selectedPricingId, selectedPricing, rentalUnits])

    // ===== view =====
    const viewTotal = calc?.total ?? preview?.totalAmount ?? 0
    const viewDeposit = calc?.deposit ?? preview?.depositAmount ?? Math.round(viewTotal * 0.3)
    const viewRemain = calc?.remain ?? viewTotal - viewDeposit
    const viewUnits = rentalUnits
    const viewUnitText = calc?.unitText ?? unitLabel(selectedPricing?.unit) ?? "ngày"

    // ================== Face Actions (VIDEO) ==================
    async function handleFaceChallenge() {
        try {
            setErrorMsg(null)
            setFaceStatus("Đang tạo thử thách...")

            setFaceToken(null)
            sessionStorage.removeItem(FACE_TOKEN_KEY)

            setChallengeId(null)
            setSteps([])

            setFaceVideoBlob(null)
            if (faceVideoUrlRef.current) {
                URL.revokeObjectURL(faceVideoUrlRef.current)
                faceVideoUrlRef.current = ""
            }
            setFaceVideoUrl("")

            const ch = await createFaceChallenge("CREATE_BOOKING", "")
            setChallengeId(ch.challengeId)
            setSteps(ch.steps || [])
            setFaceStatus("Tạo thử thách thành công ✅")
        } catch (e: any) {
            setFaceStatus(e?.response?.data?.message || e.message || "Tạo thử thách lỗi ❌")
        }
    }

    function stopRecordInternal() {
        try {
            const rec = recorderRef.current
            if (rec && rec.state !== "inactive") rec.stop()
        } catch {}
    }

    function startRecord3s() {
        if (!challengeId) return setFaceStatus("Hãy bấm 'Bắt đầu xác minh' trước ❌")
        if (recording) return

        setErrorMsg(null)
        setFaceStatus("")

        // reset clip cũ
        setFaceVideoBlob(null)
        if (faceVideoUrlRef.current) {
            URL.revokeObjectURL(faceVideoUrlRef.current)
            faceVideoUrlRef.current = ""
        }
        setFaceVideoUrl("")
        chunksRef.current = []

        const stream = (webcamRef.current?.stream as MediaStream | undefined) || undefined
        if (!stream) return setFaceStatus("Không lấy được stream webcam ❌")

        const mimeType = pickRecorderMimeType()

        let rec: MediaRecorder
        try {
            rec = mimeType
                ? new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 1_000_000 })
                : new MediaRecorder(stream, { videoBitsPerSecond: 1_000_000 })
        } catch (err) {
            console.error(err)
            return setFaceStatus("Trình duyệt không hỗ trợ MediaRecorder ❌")
        }

        recorderRef.current = rec

        rec.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
        }

        rec.onerror = () => {
            setRecording(false)
            setFaceStatus("Quay video lỗi ❌")
        }

        rec.onstop = () => {
            try {
                const blob = new Blob(chunksRef.current, { type: mimeType || "video/webm" })
                setFaceVideoBlob(blob)

                const url = URL.createObjectURL(blob)
                faceVideoUrlRef.current = url
                setFaceVideoUrl(url)

                setFaceStatus("Quay video thành công ✅")
            } finally {
                setRecording(false)
                chunksRef.current = []
                recorderRef.current = null
            }
        }

        // start + timeslice để chunk đều
        rec.start(250)
        setRecording(true)
        setFaceStatus("Đang quay 3 giây...")

        if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current)
        stopTimerRef.current = window.setTimeout(() => {
            stopTimerRef.current = null
            stopRecordInternal()
        }, 3000)
    }

    function stopRecord() {
        if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current)
        stopTimerRef.current = null
        stopRecordInternal()
    }

    async function handleFaceVerifyVideo() {
        if (!challengeId) return setFaceStatus("Chưa có challengeId ❌")
        if (!faceVideoBlob) return setFaceStatus("Chưa có video ❌")

        try {
            setFaceStatus("Đang xác minh video...")

            const file = new File([faceVideoBlob], "face.webm", { type: faceVideoBlob.type || "video/webm" })
            const res = await verifyFaceVideo(challengeId, file)

            if (!res.verified || !res.faceVerifiedToken) {
                setFaceToken(null)
                sessionStorage.removeItem(FACE_TOKEN_KEY)
                return setFaceStatus("Không khớp / không đạt liveness ❌")
            }

            setFaceToken(res.faceVerifiedToken)
            sessionStorage.setItem(FACE_TOKEN_KEY, res.faceVerifiedToken)
            setFaceStatus("Xác minh thành công ✅")
        } catch (e: any) {
            setFaceStatus(e?.response?.data?.message || e.message || "Xác minh lỗi ❌")
        }
    }

    function handleResetFace() {
        setFaceToken(null)
        setChallengeId(null)
        setSteps([])
        setFaceVideoBlob(null)

        if (faceVideoUrlRef.current) {
            URL.revokeObjectURL(faceVideoUrlRef.current)
            faceVideoUrlRef.current = ""
        }
        setFaceVideoUrl("")

        sessionStorage.removeItem(FACE_TOKEN_KEY)
        setFaceStatus("Đã reset.")
    }

    // ================== Signature Canvas (GIỮ NGUYÊN LOGIC CŨ) ==================
    function initSigCanvas() {
        const canvas = sigCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.strokeStyle = "#000"
    }

    function clearSignature() {
        const canvas = sigCanvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setSigEmpty(true)
    }

    function signatureToDataUrlPng() {
        const canvas = sigCanvasRef.current
        if (!canvas) return null
        return canvas.toDataURL("image/png")
    }

    function attachDrawHandlers(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d")
        if (!ctx) return () => {}

        let drawing = false

        const getPos = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect()
            if ("touches" in e) {
                const t = e.touches[0]
                return { x: t.clientX - rect.left, y: t.clientY - rect.top }
            }
            const m = e as MouseEvent
            return { x: m.clientX - rect.left, y: m.clientY - rect.top }
        }

        const start = (e: any) => {
            drawing = true
            const p = getPos(e)
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            e.preventDefault()
        }

        const move = (e: any) => {
            if (!drawing) return
            const p = getPos(e)
            ctx.lineTo(p.x, p.y)
            ctx.stroke()
            setSigEmpty(false)
            e.preventDefault()
        }

        const end = (e: any) => {
            drawing = false
            e.preventDefault()
        }

        canvas.addEventListener("mousedown", start)
        canvas.addEventListener("mousemove", move)
        window.addEventListener("mouseup", end)

        canvas.addEventListener("touchstart", start, { passive: false })
        canvas.addEventListener("touchmove", move, { passive: false })
        window.addEventListener("touchend", end)

        return () => {
            canvas.removeEventListener("mousedown", start)
            canvas.removeEventListener("mousemove", move)
            window.removeEventListener("mouseup", end)

            canvas.removeEventListener("touchstart", start)
            canvas.removeEventListener("touchmove", move)
            window.removeEventListener("touchend", end)
        }
    }

    useEffect(() => {
        if (!showContractStep) return
        initSigCanvas()
        const canvas = sigCanvasRef.current
        if (!canvas) return
        return attachDrawHandlers(canvas)
    }, [showContractStep])

    const currentPdfType: "unsigned" | "electronic" | "digital" =
        signedDigital ? "digital" : signedElectronic ? "electronic" : "unsigned"

    useEffect(() => {
        if (!contractId || !showContractStep) return

        let cancelled = false
        let revoke: string | null = null
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

        async function loadPdf() {
            setPdfLoading(true)
            setErrorMsg(null)
            setPdfUrl("")

            const maxTry = 12
            const delayMs = 700

            for (let i = 1; i <= maxTry; i++) {
                if (cancelled) return
                try {
                    if (contractId == null) return
                    const blob = await downloadContractPdf(contractId, currentPdfType)
                    if (cancelled) return
                    const url = URL.createObjectURL(blob)
                    revoke = url
                    setPdfUrl(url)
                    setPdfLoading(false)
                    return
                } catch (e: any) {
                    const msg =
                        e?.response?.data?.message ||
                        e?.response?.data ||
                        e?.message ||
                        "Không tải được PDF hợp đồng"

                    const shouldRetry = typeof msg === "string" && msg.toLowerCase().includes("chưa sẵn sàng")

                    if (!shouldRetry || i === maxTry) {
                        setPdfLoading(false)
                        setPdfUrl("")
                        setErrorMsg(String(msg))
                        return
                    }
                    await sleep(delayMs)
                }
            }
        }

        loadPdf()

        return () => {
            cancelled = true
            if (revoke) URL.revokeObjectURL(revoke)
        }
    }, [contractId, currentPdfType, showContractStep])

    // ================== Contract Actions ==================
    async function handleSignElectronic() {
        if (!contractId) return setErrorMsg("Thiếu contractId")
        if (!agree) return setErrorMsg("Bạn cần đồng ý điều khoản trước khi ký.")
        if (sigEmpty) return setErrorMsg("Bạn chưa ký. Vui lòng ký vào khung chữ ký.")

        try {
            setSigning(true)
            setErrorMsg(null)

            const dataUrl = signatureToDataUrlPng()
            if (!dataUrl) throw new Error("Không lấy được chữ ký từ canvas")

            const contract = await signElectronic(contractId, {
                signaturePngBase64: dataUrl,
                signerName: formData.fullName || "Customer",
                consent: true,
            })

            setContractStatus(contract.status)
            setSignedElectronic(true)
            setSignedDigital(contract.status === "SIGNED_DIGITAL")
        } catch (e: any) {
            setErrorMsg(e?.response?.data?.message || e.message || "Ký hợp đồng lỗi")
        } finally {
            setSigning(false)
        }
    }

    async function handleSignDigital() {
        if (!contractId) return setErrorMsg("Thiếu contractId")
        try {
            setSigning(true)
            setErrorMsg(null)

            const contract = await signDigital(contractId)
            setContractStatus(contract.status)
            setSignedDigital(true)
        } catch (e: any) {
            setErrorMsg(e?.response?.data?.message || e.message || "Ký số lỗi")
        } finally {
            setSigning(false)
        }
    }

    async function handlePayAfterSign() {
        if (!booking?.bookingId) return setErrorMsg("Chưa có bookingId")
        if (!signedElectronic) return setErrorMsg("Bạn phải ký hợp đồng trước khi thanh toán.")

        try {
            setLoading(true)
            setErrorMsg(null)

            const paymentCreated = await paymentApi.createPayment(
                booking.bookingId,
                {
                    payerName: formData.fullName,
                    payerEmail: formData.email,
                    payerPhone: formData.phone,
                },
                paymentMethod
            )

            if (!paymentCreated?.paymentId) throw new Error("Không nhận được paymentId từ server")

            const payRes = await paymentApi.simulatePay(paymentCreated.paymentId)
            setPayment(payRes)
            setShowContractStep(false)
        } catch (err: any) {
            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Có lỗi xảy ra khi xử lý thanh toán."
            setErrorMsg(message)
        } finally {
            setLoading(false)
        }
    }

    // ================== Payment Flow ==================
    const handlePayment = async () => {
        if (!selectedPricingId) return setErrorMsg("Chưa chọn kiểu thuê. Vui lòng quay lại bước 1.")
        if (!preview && !calc) return setErrorMsg("Thiếu dữ liệu tạm tính. Vui lòng quay lại bước 2.")
        if (!formData?.pickupDate || !formData?.pickupTime || !formData?.returnDate || !formData?.returnTime) {
            return setErrorMsg("Thiếu ngày/giờ nhận-trả. Vui lòng quay lại bước 2.")
        }

        const token = faceToken || sessionStorage.getItem(FACE_TOKEN_KEY)
        if (!token) return setErrorMsg("Bạn phải xác minh khuôn mặt trước khi tiếp tục.")

        setLoading(true)
        setErrorMsg(null)

        try {
            setContractId(null)
            setContractStatus("")
            setSignedElectronic(false)
            setSignedDigital(false)
            setSigEmpty(true)
            setShowContractStep(false)
            setPdfUrl("")

            const dto: BookingRequestDTO = {
                carId: selectedCar.carId,
                pricingId: selectedPricingId,
                rentalUnits,
                pickupLocation: formData.pickupLocation || "",
                returnLocation: formData.returnLocation || "",
                pickupDate: formData.pickupDate,
                returnDate: formData.returnDate,
                pickupTime: formData.pickupTime || "08:00",
                returnTime: formData.returnTime || "18:00",
                notes: formData.notes || "",
                fullName: formData.fullName || "",
                email: formData.email || "",
                phone: formData.phone || "",
                address: formData.address || "",
                idNumber: formData.idNumber || "",
                licenseNumber: formData.licenseNumber || "",
            }

            const bookingRes = (
                await api.post<BookingResponseDTO>("/user/bookings", dto, { headers: { [FACE_HEADER]: token } })
            ).data

            setBooking(bookingRes)

            if (!bookingRes.contractId) throw new Error("Server không trả contractId")
            setContractId(bookingRes.contractId)

            const st = bookingRes.contractStatus
            setContractStatus(isValidContractStatus(st) ? st : "DRAFT")

            setShowContractStep(true)
        } catch (err: any) {
            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Có lỗi xảy ra khi tạo booking."
            setErrorMsg(message)
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadQR = () => {
        if (!payment?.qrBase64) return
        const link = document.createElement("a")
        link.href = `data:image/png;base64,${payment.qrBase64}`
        link.download = `QR_Booking_${booking?.bookingId || "payment"}.png`
        link.click()
    }

    return (
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
                {/* Thông tin thanh toán */}
                <Card className="border-sky-100 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-gray-800">Thông Tin Thanh Toán</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-6 text-sm">
                            <div>
                                <p className="text-gray-600">Tổng giá trị:</p>
                                <p className="font-bold text-lg">{money(viewTotal)}đ</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Tiền cọc (30%):</p>
                                <p className="font-bold text-lg text-sky-600">{money(viewDeposit)}đ</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Thanh toán khi nhận:</p>
                                <p className="font-medium">{money(viewRemain)}đ</p>
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-gray-600">
                            Thời lượng thuê: <b>{viewUnits}</b> {viewUnitText}
                            {selectedPricing ? (
                                <>
                                    {" "}
                                    • Giá/{viewUnitText}: <b>{money(Number(selectedPricing.price ?? 0))}đ</b>
                                </>
                            ) : null}
                        </p>

                        {!selectedPricingId && (
                            <p className="mt-2 text-sm text-red-600">
                                Chưa có kiểu thuê. Vui lòng quay lại bước 1 để chọn kiểu thuê.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Face Verify (VIDEO) */}
                <Card className="border-sky-100 shadow-lg">
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="space-y-0.5">
                            <CardTitle className="text-gray-800">Xác minh khuôn mặt (Video)</CardTitle>
                            <p className="text-sm text-gray-500">
                                Bắt đầu xác minh → quay webcam 3 giây (nhìn thẳng, đủ sáng) → bấm xác minh.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
              <span
                  className={`text-sm font-semibold px-2 py-1 rounded-md border ${
                      faceVerified
                          ? "text-green-700 border-green-200 bg-green-50"
                          : "text-red-700 border-red-200 bg-red-50"
                  }`}
              >
                {faceVerified ? "Đã xác minh ✅" : "Chưa xác minh ❌"}
              </span>

                            <Button type="button" variant="outline" onClick={handleResetFace}>
                                Reset
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                className="bg-sky-600 hover:bg-sky-700 text-white"
                                onClick={handleFaceChallenge}
                                disabled={recording}
                            >
                                Bắt đầu xác minh
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={startRecord3s}
                                disabled={!challengeId || recording}
                                title={!challengeId ? "Hãy bấm 'Bắt đầu xác minh' trước" : undefined}
                            >
                                {recording ? "Đang quay..." : "Quay 3 giây"}
                            </Button>

                            {recording && (
                                <Button type="button" variant="outline" onClick={stopRecord}>
                                    Dừng quay
                                </Button>
                            )}

                            <Button
                                type="button"
                                onClick={handleFaceVerifyVideo}
                                disabled={!challengeId || !faceVideoBlob || recording}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                Xác minh video
                            </Button>
                        </div>

                        <div className="text-sm text-gray-700 space-y-1">
                            <div>
                                <b>Bước:</b>{" "}
                                {steps.length ? (
                                    <span className="text-gray-700">{steps.join(", ")}</span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <b>Trạng thái:</b>
                                <span className={`${faceVerified ? "text-green-700" : "text-gray-600"}`}>
                  {faceStatus || "-"}
                </span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="rounded-xl border bg-white p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-gray-800">Camera</p>
                                    <span className="text-xs text-gray-500">*đủ sáng, nhìn thẳng</span>
                                </div>
                                <div className="overflow-hidden rounded-xl bg-black aspect-video">
                                    <Webcam
                                        ref={webcamRef}
                                        audio={false}
                                        videoConstraints={{
                                            facingMode: "user",
                                            width: 640,
                                            height: 480,
                                            frameRate: { ideal: 30, max: 30 }, // ✅ tránh fps “ảo”
                                        }}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl border bg-white p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-gray-800">Video đã quay</p>
                                    {faceVideoBlob ? (
                                        <span className="text-xs text-green-700">Đã có video ✅</span>
                                    ) : (
                                        <span className="text-xs text-gray-500">Chưa có video</span>
                                    )}
                                </div>
                                <div className="overflow-hidden rounded-xl bg-gray-100 aspect-video flex items-center justify-center">
                                    {faceVideoUrl ? (
                                        <video src={faceVideoUrl} controls className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm text-gray-500">Bấm “Quay 3 giây” để tạo video</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!faceVerified && (
                            <div className="text-sm text-red-600">
                                Bạn cần xác minh khuôn mặt trước khi có thể tiếp tục.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ===== CONTRACT STEP (giữ nguyên của bạn) ===== */}
                {showContractStep && contractId && (
                    <Card className="border-sky-100 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-gray-800 flex items-center gap-2">
                                <FileSignature className="w-5 h-5" />
                                Ký hợp đồng thuê xe
                            </CardTitle>
                            <p className="text-sm text-gray-500">Bạn phải ký hợp đồng trước khi thanh toán.</p>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="text-sm">
                                <b>ContractId:</b> {contractId} • <b>Trạng thái:</b>{" "}
                                <span className="font-semibold">{contractStatus || "DRAFT"}</span>
                            </div>

                            <div className="rounded-xl border overflow-hidden">
                                {pdfUrl ? (
                                    <iframe src={pdfUrl} className="w-full h-[520px]" />
                                ) : (
                                    <div className="p-4 text-sm text-gray-600">
                                        {pdfLoading ? "Đang tải hợp đồng..." : "Chưa tải được hợp đồng"}
                                    </div>
                                )}
                            </div>

                            {!signedElectronic && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-800">Chữ ký</p>
                                        <Button type="button" variant="outline" onClick={clearSignature}>
                                            Xoá chữ ký
                                        </Button>
                                    </div>

                                    <canvas ref={sigCanvasRef} width={900} height={240} className="w-full bg-white border rounded-xl" />
                                    <p className="text-xs text-gray-500">* Ký bằng chuột hoặc cảm ứng.</p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {!signedElectronic ? (
                                    <Button
                                        type="button"
                                        onClick={handleSignElectronic}
                                        disabled={signing || sigEmpty || !agree}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        title={!agree ? "Bạn cần đồng ý điều khoản" : sigEmpty ? "Bạn chưa ký" : undefined}
                                    >
                                        {signing ? "Đang ký..." : "Ký hợp đồng (A)"}
                                    </Button>
                                ) : (
                                    <Button type="button" disabled className="bg-emerald-600 text-white">
                                        Đã ký điện tử ✅
                                    </Button>
                                )}

                                {/*{signedElectronic && !signedDigital && (*/}
                                {/*    <Button type="button" onClick={handleSignDigital} disabled={signing} variant="outline">*/}
                                {/*        {signing ? "Đang ký số..." : "Ký số (B - optional)"}*/}
                                {/*    </Button>*/}
                                {/*)}*/}

                                {signedDigital && (
                                    <Button type="button" disabled variant="outline">
                                        Đã ký số ✅
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    onClick={handlePayAfterSign}
                                    disabled={!signedElectronic || loading}
                                    className="bg-sky-500 hover:bg-sky-600 text-white"
                                >
                                    Thanh toán sau khi ký
                                </Button>
                            </div>

                            <div className="text-xs text-gray-500">
                                *Ký số (B) là server-side bằng key test/self-signed nên Adobe có thể báo “Unknown/Not trusted”.
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Chọn phương thức (ẩn khi đang ký hợp đồng) */}
                {!showContractStep && (
                    <Card className="border-sky-100 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-gray-800">Chọn Phương Thức Thanh Toán</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4">
                            {paymentMethods.map((m) => (
                                <Button
                                    key={m.key}
                                    variant="ghost"
                                    onClick={() => setPaymentMethod(m.key)}
                                    className={`relative flex items-center justify-center p-0 h-24 border rounded-xl overflow-hidden transition-all
                    ${paymentMethod === m.key ? "border-sky-500 shadow-md scale-105" : "border-gray-200 hover:border-sky-300 hover:shadow-sm"}`}
                                >
                                    <span className="font-semibold">{m.label}</span>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Điều khoản */}
                <div className="flex items-center gap-2">
                    <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} />
                    <span className="text-sm text-gray-700">
            Tôi đồng ý với{" "}
                        <a href="#" className="text-sky-600 underline">
              điều khoản thuê xe
            </a>
          </span>
                </div>

                {/* Loading */}
                {loading && (
                    <Card className="border-sky-200 bg-sky-50">
                        <CardHeader>
                            <CardTitle className="text-sky-600">Đang xử lý...</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-48 w-48 mx-auto rounded-lg" />
                        </CardContent>
                    </Card>
                )}

                {/* Lỗi */}
                {errorMsg && (
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <CardTitle className="text-red-700">Lỗi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-red-700">{errorMsg}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Thành công */}
                {payment && (
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="text-green-700">✅ Đặt xe thành công</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p>
                                Mã đơn: <b>{payment.bookingId}</b>
                            </p>
                            <p>
                                Khách hàng: {payment.payerName} - {payment.payerPhone}
                            </p>
                            <p>
                                Trạng thái: <b>{payment.status}</b>
                            </p>

                            {payment.qrBase64 && (
                                <div className="flex flex-col items-center mt-4">
                                    <p className="text-gray-700 mb-2">
                                        Vui lòng <b>lưu lại mã QR</b> để làm thủ tục nhận xe.
                                    </p>
                                    <img
                                        src={`data:image/png;base64,${payment.qrBase64}`}
                                        alt="QR Payment"
                                        className="w-48 h-48 border rounded-lg shadow"
                                    />
                                    <Button
                                        onClick={handleDownloadQR}
                                        className="mt-4 flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white"
                                    >
                                        <Download className="h-4 w-4" /> Tải xuống QR
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Nút hành động */}
                {!payment && !loading && (
                    <div className="flex justify-between pt-4">
                        <Button onClick={prevStep} variant="outline" className="border-sky-200">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                        </Button>

                        <Button
                            onClick={handlePayment}
                            disabled={!agree || !selectedPricingId || !faceVerified || showContractStep}
                            className="bg-sky-500 hover:bg-sky-600 text-white"
                            title={
                                showContractStep
                                    ? "Bạn đang ở bước ký hợp đồng"
                                    : !selectedPricingId
                                        ? "Chưa chọn kiểu thuê"
                                        : !agree
                                            ? "Bạn chưa đồng ý điều khoản"
                                            : !faceVerified
                                                ? "Bạn chưa xác minh khuôn mặt"
                                                : undefined
                            }
                        >
                            Tạo booking & ký hợp đồng
                        </Button>
                    </div>
                )}
            </div>

            {/* RIGHT */}
            <div>
                <Card className="border-sky-100 shadow-lg sticky top-24">
                    <CardHeader>
                        <CardTitle className="text-gray-800">Tóm Tắt Đơn Hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex gap-3">
                            <Image
                                src={`${selectedCar.imageUrl}`}
                                alt={selectedCar.carName}
                                width={100}
                                height={70}
                                className="rounded object-cover"
                            />
                            <div>
                                <h4 className="font-semibold">{selectedCar.carName}</h4>
                                <p className="text-gray-600">
                                    {viewUnits} {viewUnitText}
                                </p>
                                <p className="font-semibold text-sky-600">{money(viewTotal)}đ</p>
                            </div>
                        </div>

                        <div className="divide-y">
                            <div className="flex justify-between py-1">
                                <span>Khách hàng:</span>
                                <span>{formData.fullName}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Điện thoại:</span>
                                <span>{formData.phone}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Ngày nhận:</span>
                                <span>
                  {formData.pickupDate} {formData.pickupTime}
                </span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Ngày trả:</span>
                                <span>
                  {formData.returnDate} {formData.returnTime}
                </span>
                            </div>
                        </div>

                        <div className="rounded-lg border border-sky-100 bg-sky-50 p-3">
                            <div className="flex justify-between">
                                <span>Tiền cọc (30%):</span>
                                <b>{money(viewDeposit)}đ</b>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span>Còn lại khi nhận:</span>
                                <b>{money(viewRemain)}đ</b>
                            </div>
                        </div>

                        {!selectedPricingId && (
                            <p className="text-sm text-red-600">
                                Chưa có kiểu thuê. Vui lòng quay lại bước 1 để chọn kiểu thuê.
                            </p>
                        )}

                        {!faceVerified && (
                            <p className="text-sm text-red-600">Chưa xác minh khuôn mặt — không thể tiếp tục.</p>
                        )}

                        {showContractStep && (
                            <p className="text-sm text-sky-700">
                                Bạn đang ở bước ký hợp đồng. Hãy ký xong rồi bấm “Thanh toán sau khi ký”.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
