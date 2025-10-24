"use client"

import { useState, useEffect } from "react"
import { Car, Shield, Clock, MapPin, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { getFeaturedCars } from "@/src/services/user/homeApi"
import type { FeaturedCar } from "@/src/services/user/homeApi"
import Testimonials from "./Testimonials"



export default function HomePage() {
  const [currentCar, setCurrentCar] = useState(0)

  const [isVisible, setIsVisible] = useState(false)
  const [featuredCars, setFeaturedCars] = useState<FeaturedCar[]>([])
  const [loading, setLoading] = useState(true)

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

    return () => {
      clearInterval(carTimer)
    }
  }, [featuredCars])




  // auto slide mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCar((prev) => (prev + 1) % featuredCars.length);
    }, 5000); // 5000ms = 5 giây

    return () => clearInterval(interval); // cleanup khi unmount
  }, [featuredCars.length]);


  return (
    <div className={`min-h-screen bg-white transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`} >
      {/* Hero Section với Background Image */}
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
            {/* Tiêu đề */}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg leading-snug">
              Chuyến Đi <span className="text-sky-400">Thư Giãn</span> <br />
              Bắt Đầu Với Một Chiếc Xe Hoàn Hảo
            </h1>

            {/* Mô tả */}
            <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-200 drop-shadow-md">
              Cho dù bạn đi nghỉ dưỡng cuối tuần hay du lịch xa, hãy để chúng tôi giúp bạn
              tìm chiếc xe phù hợp. Nhanh chóng, tiện lợi và luôn sẵn sàng đồng hành cùng bạn.
            </p>

            {/* CTA */}
            <div className="flex items-center space-x-4 animate-in slide-in-from-left-10 duration-1000 delay-300">
              <div className="bg-sky-500 p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-base md:text-lg drop-shadow-md">
                  Xem ngay cách đặt xe chỉ trong 3 bước
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Đặt Xe + Steps nổi trên banner */}
      <section className="relative -mt-20 z-30">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-12">

            {/* Form */}
            <div className="md:col-span-4 bg-sky-500 p-6 md:p-8 flex flex-col justify-center animate-in slide-in-from-left-8 duration-700">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Bắt Đầu Chuyến Đi</h2>
              <form className="space-y-3 text-sm">
                <div>
                  <Label className="text-white text-xs">Điểm nhận xe</Label>
                  <Input placeholder="VD: Hà Nội, Nội Bài..." className="mt-1 bg-white border-0 rounded-lg text-sm py-2" />
                </div>
                <div>
                  <Label className="text-white text-xs">Điểm trả xe</Label>
                  <Input placeholder="VD: TP.HCM, Tân Sơn Nhất..." className="mt-1 bg-white border-0 rounded-lg text-sm py-2" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-white text-xs">Ngày nhận</Label>
                    <Input type="date" className="mt-1 bg-white border-0 rounded-lg text-sm py-2" />
                  </div>
                  <div>
                    <Label className="text-white text-xs">Ngày trả</Label>
                    <Input type="date" className="mt-1 bg-white border-0 rounded-lg text-sm py-2" />
                  </div>
                </div>
                <div>
                  <Label className="text-white text-xs">Giờ nhận xe</Label>
                  <Input type="time" className="mt-1 bg-white border-0 rounded-lg text-sm py-2" />
                </div>
                <Button className="w-full bg-white text-sky-600 hover:bg-gray-100 py-2.5 font-semibold rounded-lg shadow-md text-sm">
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
                {/* Step 1 */}
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

                {/* Step 2 */}
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

                {/* Step 3 */}
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

      {/* Featured Vehicles Grid */}
      <section className="py-16 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-sky-500 font-medium tracking-wide uppercase">
              Những gì chúng tôi cung cấp
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">
              Xe Nổi Bật
            </h2>
            <p className="text-gray-500 mt-2">
              Lựa chọn những dòng xe chất lượng nhất cho chuyến đi của bạn
            </p>
          </div>

          {/* Grid hiển thị 3 xe trên desktop */}
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group"
              >
                {/* Hình ảnh */}
                <div
                  className="h-56 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(http://localhost:8080${car.imageUrl})` }}
                />
                {/* Nội dung */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-sky-600 transition-colors duration-300">
                    {car.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600 text-sm">{car.brand}</span>
                    <span className="text-sky-600 font-bold">
                      {car.price.toLocaleString()} VND
                      <span className="text-xs font-normal text-gray-500"> /ngày</span>
                    </span>
                  </div>
                  {/* Nút */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105 px-4 py-2">
                      Đặt ngay
                    </button>
                    <button className="border border-sky-300 text-sky-600 hover:bg-sky-50 rounded-lg px-4 py-2 transition-colors">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-white to-sky-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Hình ảnh */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg group animate-in slide-in-from-left-8 duration-700">
              <div
                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: "url('/banner.jpeg')" }}
              ></div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              {/* Text nổi trên ảnh (option nếu muốn) */}
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Carbook</h3>
                <p className="text-sm opacity-80">Hành trình đáng nhớ của bạn bắt đầu tại đây</p>
              </div>
            </div>

            {/* Nội dung */}
            <div className="animate-in slide-in-from-right-8 duration-700">
              <span className="text-sky-500 font-semibold uppercase tracking-wide">
                Về Chúng Tôi
              </span>
              <h2 className="text-4xl font-extrabold text-gray-800 mt-3 mb-6 leading-snug">
                Trải Nghiệm Thuê Xe <br /> <span className="text-sky-500">Đơn Giản & Đáng Tin Cậy</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                Tại <span className="font-semibold text-sky-600">Carbook</span>, chúng tôi không chỉ cung cấp xe –
                mà còn mang đến sự thoải mái, an toàn và tiện lợi cho hành trình của bạn.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Với nhiều năm kinh nghiệm cùng đội ngũ tận tâm, chúng tôi luôn sẵn sàng đồng hành để
                giúp bạn tận hưởng chuyến đi một cách <span className="font-semibold">trọn vẹn</span>.
              </p>
              <Link href="/cars">
                <Button className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-lg shadow-lg text-lg transition-transform hover:scale-105">
                  Khám Phá Ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Services Section */}
      <section className="py-20 bg-sky-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sky-500 font-medium uppercase tracking-wide">Dịch vụ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Dịch Vụ Mới Nhất Của Chúng Tôi
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Trải nghiệm những dịch vụ chất lượng cao, tiện lợi và sang trọng – dành riêng cho bạn.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Wedding Car */}
            <div className="relative group rounded-xl overflow-hidden shadow-lg">
              <img
                src="/wedding-car.jpg"
                alt="Lễ Cưới"
                className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="bg-white/90 w-12 h-12 flex items-center justify-center rounded-full mb-3 shadow">
                  <Car className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="text-lg font-bold">Lễ Cưới</h3>
                <p className="text-sm opacity-90">
                  Xe cưới sang trọng cho ngày trọng đại, mang đến khoảnh khắc hoàn hảo.
                </p>
              </div>
            </div>

            {/* City Transfer */}
            <div className="relative group rounded-xl overflow-hidden shadow-lg">
              <img
                src="/city-transfer.jpg"
                alt="Đưa Đón Thành Phố"
                className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="bg-white/90 w-12 h-12 flex items-center justify-center rounded-full mb-3 shadow">
                  <MapPin className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="text-lg font-bold">Đưa Đón Thành Phố</h3>
                <p className="text-sm opacity-90">
                  Dịch vụ đưa đón tiện lợi, an toàn và nhanh chóng trong thành phố.
                </p>
              </div>
            </div>

            {/* Airport Transfer */}
            <div className="relative group rounded-xl overflow-hidden shadow-lg">
              <img
                src="/airport-transfer.jpg"
                alt="Đưa Đón Sân Bay"
                className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="bg-white/90 w-12 h-12 flex items-center justify-center rounded-full mb-3 shadow">
                  <Shield className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="text-lg font-bold">Đưa Đón Sân Bay</h3>
                <p className="text-sm opacity-90">
                  Dịch vụ 24/7 chuyên nghiệp, đúng giờ và tiện lợi cho mọi chuyến bay.
                </p>
              </div>
            </div>

            {/* City Tour */}
            <div className="relative group rounded-xl overflow-hidden shadow-lg">
              <img
                src="/city-tour.jpg"
                alt="Tour Toàn Thành Phố"
                className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="bg-white/90 w-12 h-12 flex items-center justify-center rounded-full mb-3 shadow">
                  <Clock className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="text-lg font-bold">Tour Toàn Thành Phố</h3>
                <p className="text-sm opacity-90">
                  Khám phá mọi ngóc ngách thành phố với dịch vụ tour riêng biệt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <div key={index} className="bg-white shadow-lg rounded-xl py-8 px-6 text-center hover:shadow-2xl hover:scale-105 transition-transform duration-500 group">
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

