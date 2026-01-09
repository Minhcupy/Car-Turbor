"use client"

import { useEffect, useMemo, useState } from "react"
import { Car, Shield, Clock, MapPin, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getFeaturedCars } from "@/src/services/user/homeApi"
import type { FeaturedCar } from "@/src/services/user/homeApi"
import Testimonials from "./Testimonials"

// ✅ thêm Dialog của shadcn
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function HomePage() {
  const router = useRouter()

  const [currentCar, setCurrentCar] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [featuredCars, setFeaturedCars] = useState<FeaturedCar[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ Video popup state
  const [openVideo, setOpenVideo] = useState(false)

  // ✅ Form state
  const [pickupLocation, setPickupLocation] = useState("")
  const [returnLocation, setReturnLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [pickupTime, setPickupTime] = useState("09:00")
  const [returnTime, setReturnTime] = useState("18:00")
  const [submitError, setSubmitError] = useState<string | null>(null)

  // ✅ đổi đường dẫn video tại đây
  // Đặt file vào: /public/booking-guide.mp4
  const VIDEO_SRC = "/4buoc.mp4"

  useEffect(() => {
    async function loadCars() {
      try {
        const data = await getFeaturedCars()
        setFeaturedCars(data)
      } catch (error) {
        console.error("Error loading featured cars:", error)
      } finally {
        setLoading(false)
      }
    }
    loadCars()
  }, [])

  useEffect(() => {
    setIsVisible(true)
    const carTimer = setInterval(() => {
      if (featuredCars.length > 0) {
        setCurrentCar((prev) => (prev + 1) % featuredCars.length)
      }
    }, 4000)

    return () => clearInterval(carTimer)
  }, [featuredCars])

  // auto slide mỗi 5 giây
  useEffect(() => {
    if (featuredCars.length === 0) return
    const interval = setInterval(() => {
      setCurrentCar((prev) => (prev + 1) % featuredCars.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [featuredCars.length])

  // ✅ validate datetime
  const isValidRange = useMemo(() => {
    if (!pickupDate || !returnDate || !pickupTime || !returnTime) return false
    const start = new Date(`${pickupDate}T${pickupTime}:00`)
    const end = new Date(`${returnDate}T${returnTime}:00`)
    return end.getTime() > start.getTime()
  }, [pickupDate, returnDate, pickupTime, returnTime])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!pickupLocation.trim() || !returnLocation.trim()) {
      setSubmitError("Vui lòng nhập điểm nhận và điểm trả xe.")
      return
    }
    if (!pickupDate || !returnDate) {
      setSubmitError("Vui lòng chọn ngày nhận và ngày trả.")
      return
    }
    if (!isValidRange) {
      setSubmitError("Thời gian trả phải sau thời gian nhận.")
      return
    }

    const qs = new URLSearchParams({
      pickupLocation: pickupLocation.trim(),
      returnLocation: returnLocation.trim(),
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
    }).toString()

    router.push(`/user/cars?${qs}`)
  }

  return (
      <div
          className={`min-h-screen bg-white transition-opacity duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        {/* Hero Section */}
        <section
            className="relative h-screen bg-gradient-to-r from-sky-900 to-sky-700 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/luxury-car-on-road-with-blue-sky.jpg')",
              backgroundColor: "#0c4a6e",
            }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 to-sky-700/80"></div>

          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white animate-in slide-in-from-left-10 duration-1000">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg leading-snug">
                Chuyến Đi <span className="text-sky-400">Thư Giãn</span> <br />
                Bắt Đầu Với Một Chiếc Xe Hoàn Hảo
              </h1>

              <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-200 drop-shadow-md">
                Cho dù bạn đi nghỉ dưỡng cuối tuần hay du lịch xa, hãy để chúng tôi giúp bạn tìm chiếc xe phù hợp.
                Nhanh chóng, tiện lợi và luôn sẵn sàng đồng hành cùng bạn.
              </p>

              {/* ✅ Play -> mở popup video */}
              <div className="flex items-center space-x-4 animate-in slide-in-from-left-10 duration-1000 delay-300">
                <button
                    type="button"
                    onClick={() => setOpenVideo(true)}
                    className="bg-sky-500 p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
                    aria-label="Xem video hướng dẫn"
                >
                  <Play className="h-6 w-6 text-white" />
                </button>

                <div>
                <span className="text-base md:text-lg drop-shadow-md">
                  Xem ngay cách đặt xe chỉ trong 3 bước
                </span>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Dialog Video */}
          <Dialog
              open={openVideo}
              onOpenChange={(v) => {
                setOpenVideo(v)
              }}
          >
            <DialogContent className="max-w-3xl p-0 overflow-hidden">
              <DialogHeader className="px-6 pt-6 pb-3">
                <DialogTitle>Hướng dẫn đặt xe (3 bước)</DialogTitle>
              </DialogHeader>

              {/* unmount khi đóng => dừng video */}
              {openVideo && (
                  <div className="px-6 pb-6">
                    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-black">
                      <video
                          className="w-full h-full"
                          controls
                          autoPlay
                          playsInline
                          src={VIDEO_SRC}
                      />
                    </div>
                  </div>
              )}
            </DialogContent>
          </Dialog>
        </section>

        {/* Form + Steps */}
        <section className="relative -mt-20 z-30">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-12">
              {/* ✅ Form */}
              <div className="md:col-span-4 bg-sky-500 p-6 md:p-8 flex flex-col justify-center animate-in slide-in-from-left-8 duration-700">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Bắt Đầu Chuyến Đi</h2>

                <form className="space-y-3 text-sm" onSubmit={handleSearch}>
                  <div>
                    <Label className="text-white text-xs">Điểm nhận xe</Label>
                    <Input
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="VD: Hà Nội, Nội Bài..."
                        className="mt-1 bg-white border-0 rounded-lg text-sm py-2"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-xs">Điểm trả xe</Label>
                    <Input
                        value={returnLocation}
                        onChange={(e) => setReturnLocation(e.target.value)}
                        placeholder="VD: TP.HCM, Tân Sơn Nhất..."
                        className="mt-1 bg-white border-0 rounded-lg text-sm py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-white text-xs">Ngày nhận</Label>
                      <Input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="mt-1 bg-white border-0 rounded-lg text-sm py-2"
                      />
                    </div>
                    <div>
                      <Label className="text-white text-xs">Ngày trả</Label>
                      <Input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="mt-1 bg-white border-0 rounded-lg text-sm py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-white text-xs">Giờ nhận</Label>
                      <Input
                          type="time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="mt-1 bg-white border-0 rounded-lg text-sm py-2"
                      />
                    </div>
                    <div>
                      <Label className="text-white text-xs">Giờ trả</Label>
                      <Input
                          type="time"
                          value={returnTime}
                          onChange={(e) => setReturnTime(e.target.value)}
                          className="mt-1 bg-white border-0 rounded-lg text-sm py-2"
                      />
                    </div>
                  </div>

                  {submitError && (
                      <p className="text-white/90 text-xs bg-red-500/30 rounded-md px-3 py-2">
                        {submitError}
                      </p>
                  )}

                  <Button
                      type="submit"
                      className="w-full bg-white text-sky-600 hover:bg-gray-100 py-2.5 font-semibold rounded-lg shadow-md text-sm"
                  >
                    Tìm Xe Ngay
                  </Button>
                </form>
              </div>

              {/* Steps */}
              <div className="md:col-span-8 p-6 md:p-10 animate-in fade-in duration-1000 delay-200">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 text-center">
                  Quy Trình Thuê Xe Dễ Dàng
                </h3>

                <div className="flex justify-around gap-4">
                  <div className="relative bg-white rounded-xl shadow-md p-6 w-56 text-center animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold shadow-md">
                      01
                    </div>
                    <div className="bg-sky-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-7 w-7 text-sky-500" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Chọn Điểm Nhận Xe</h4>
                    <p className="text-gray-600 text-xs">Chọn nơi nhận xe thuận tiện nhất cho bạn.</p>
                  </div>

                  <div className="relative bg-white rounded-xl shadow-md p-6 w-56 text-center animate-in slide-in-from-bottom-8 duration-700 delay-500">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold shadow-md">
                      02
                    </div>
                    <div className="bg-sky-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-7 w-7 text-sky-500" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Chọn Ưu Đãi</h4>
                    <p className="text-gray-600 text-xs">Khám phá gói khuyến mãi phù hợp.</p>
                  </div>

                  <div className="relative bg-white rounded-xl shadow-md p-6 w-56 text-center animate-in slide-in-from-bottom-8 duration-700 delay-700">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold shadow-md">
                      03
                    </div>
                    <div className="bg-sky-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="h-7 w-7 text-sky-500" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Hoàn Tất Đặt Xe</h4>
                    <p className="text-gray-600 text-xs">Thanh toán và nhận xe dễ dàng, nhanh chóng.</p>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Link href="/user/cars">
                    <Button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg text-sm shadow-lg">
                      Đặt Xe Hoàn Hảo Của Bạn
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ... phần còn lại của bạn giữ nguyên ... */}
        <Testimonials />

        {/* Stats Counter */}
        <section className="py-16 bg-gradient-to-r from-sky-50 to-blue-100">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { value: "60+", label: "Năm Kinh Nghiệm" },
                { value: "1090+", label: "Xe Hoạt Động" },
                { value: "2590+", label: "Khách Hàng Hài Lòng" },
                { value: "67+", label: "Chi Nhánh" },
              ].map((stat, index) => (
                  <div
                      key={index}
                      className="bg-white shadow-lg rounded-xl py-8 px-6 text-center hover:shadow-2xl hover:scale-105 transition-transform duration-500 group"
                  >
                    <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent animate-pulse group-hover:scale-110 transition-transform duration-500">
                      {stat.value}
                    </div>
                    <p className="text-gray-700 text-base mt-3 group-hover:text-sky-600 transition-colors duration-300">
                      {stat.label}
                    </p>
                  </div>
              ))}
            </div>
          </div>
        </section>
      </div>
  )
}
