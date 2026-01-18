"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

import { useSearchParams } from "next/navigation"
import { Car, Search, Droplets, Zap, ChevronLeft, ChevronRight } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import CarCard from "./CarCard"
import type { CarUserDTO } from "@/src/services/user/carApi"
import { getAllCars, searchCars } from "@/src/services/user/carApi"
import { carTypeApi, type CarTypeDTO } from "@/src/services/carTypeApi"

export default function CarsPage() {
  const searchParams = useSearchParams()

  const [cars, setCars] = useState<CarUserDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [loadMode, setLoadMode] = useState<"all" | "search">("all")

  // ====== ref để scroll xuống danh sách xe ======
  const resultsRef = useRef<HTMLDivElement | null>(null)
  const didAutoScrollRef = useRef(false)
  const [carTypes, setCarTypes] = useState<CarTypeDTO[]>([])
  const [loadingTypes, setLoadingTypes] = useState(false)

  // ====== Filters (lọc client) ======
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [selectedSeats, setSelectedSeats] = useState("all")
  const [selectedFuelType, setSelectedFuelType] = useState("all")

  // ====== Carousel: luôn 3 xe / dịch 1 xe ======
  const visibleCount = 3
  const [index, setIndex] = useState(0) // vị trí bắt đầu
  const [stepPx, setStepPx] = useState(0) // width card + gap
  const trackRef = useRef<HTMLDivElement | null>(null)
  const firstItemRef = useRef<HTMLDivElement | null>(null)

  // ===== 1) Đọc query URL để search =====
  const urlSearch = useMemo(() => {
    const pickupLocation = searchParams.get("pickupLocation") || ""
    const returnLocation = searchParams.get("returnLocation") || ""
    const pickupDate = searchParams.get("pickupDate") || ""
    const returnDate = searchParams.get("returnDate") || ""
    const pickupTime = searchParams.get("pickupTime") || ""
    const returnTime = searchParams.get("returnTime") || ""

    const hasSearch =
        !!pickupLocation &&
        !!returnLocation &&
        !!pickupDate &&
        !!returnDate &&
        !!pickupTime &&
        !!returnTime

    return {
      hasSearch,
      pickupLocation,
      returnLocation,
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
    }
  }, [searchParams])

  useEffect(() => {
    const fetchCarTypes = async () => {
      try {
        setLoadingTypes(true)
        const data = await carTypeApi.getAll()
        // (tuỳ chọn) sort theo tên
        data.sort((a, b) => a.typeName.localeCompare(b.typeName, "vi"))
        setCarTypes(data)
      } catch (e) {
        console.error("❌ Lỗi lấy loại xe:", e)
        setCarTypes([])
      } finally {
        setLoadingTypes(false)
      }
    }

    fetchCarTypes()
  }, [])

  // ===== 2) Gọi API dựa theo query =====
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true)
      didAutoScrollRef.current = false

      try {
        if (urlSearch.hasSearch) {
          setLoadMode("search")
          const data = await searchCars({
            pickupLocation: urlSearch.pickupLocation,
            returnLocation: urlSearch.returnLocation,
            pickupDate: urlSearch.pickupDate,
            returnDate: urlSearch.returnDate,
            pickupTime: urlSearch.pickupTime,
            returnTime: urlSearch.returnTime,
          })
          setCars(data)
        } else {
          setLoadMode("all")
          const data = await getAllCars()
          setCars(data)
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách xe:", err)
        setCars([])
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [urlSearch])

  // ===== 2.1) Auto-scroll khi có search query =====
  useEffect(() => {
    if (!urlSearch.hasSearch) return
    if (loading) return
    if (didAutoScrollRef.current) return

    const t = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      didAutoScrollRef.current = true
    }, 200)

    return () => window.clearTimeout(t)
  }, [urlSearch.hasSearch, loading])

  // ===== 3) Lọc client =====
  const filteredCars = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return cars.filter((car) => {
      const carName = (car.carName || "").toLowerCase()
      const brandName = (car.brandName || "").toLowerCase()
      const typeName = (car.typeName || "").toLowerCase()

      const matchesSearch =
          !term || carName.includes(term) || brandName.includes(term) || typeName.includes(term)

      const matchesCategory =
          selectedCategory === "all" || (car.typeName || "").includes(selectedCategory)

      const matchesSeats = selectedSeats === "all" || String(car.seats) === selectedSeats

      const matchesFuelType = selectedFuelType === "all" || car.fuelType === selectedFuelType

      let matchesPrice = true
      if (selectedPriceRange !== "all" && car.price !== null && car.price !== undefined) {
        const price = car.price
        switch (selectedPriceRange) {
          case "under-800k":
            matchesPrice = price < 800000
            break
          case "800k-1200k":
            matchesPrice = price >= 800000 && price <= 1200000
            break
          case "over-1200k":
            matchesPrice = price > 1200000
            break
        }
      }

      return matchesSearch && matchesCategory && matchesPrice && matchesSeats && matchesFuelType
    })
  }, [cars, searchTerm, selectedCategory, selectedPriceRange, selectedSeats, selectedFuelType])

  const gasolineCars = useMemo(() => cars.filter((c) => c.fuelType === "gasoline"), [cars])
  const electricCars = useMemo(() => cars.filter((c) => c.fuelType === "electric"), [cars])

  // ===== Carousel derived =====
  const maxIndex = useMemo(() => Math.max(0, filteredCars.length - visibleCount), [filteredCars.length])

  // reset index khi filter/dữ liệu đổi
  useEffect(() => {
    setIndex(0)
  }, [
    searchTerm,
    selectedCategory,
    selectedPriceRange,
    selectedSeats,
    selectedFuelType,
    loadMode,
    urlSearch.hasSearch,
    cars.length,
  ])

  // kẹp index nếu list ngắn lại
  useEffect(() => {
    setIndex((cur) => Math.min(cur, maxIndex))
  }, [maxIndex])

  // đo stepPx = width item + gap để dịch đúng 1 xe/lần
  useLayoutEffect(() => {
    if (loading) return
    if (!firstItemRef.current || !trackRef.current) return

    const measure = () => {
      const itemW = firstItemRef.current?.getBoundingClientRect().width ?? 0
      const gapStr = getComputedStyle(trackRef.current!).gap || "0px"
      const gap = Number.parseFloat(gapStr) || 0
      setStepPx(itemW + gap)
    }

    // đợi browser render layout xong rồi đo
    const raf = requestAnimationFrame(measure)

    window.addEventListener("resize", measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", measure)
    }
  }, [loading, filteredCars.length])


  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Fix Tailwind dynamic class
  const statStyles = {
    blue: { border: "border-blue-100", bg: "bg-blue-100", text: "text-blue-600" },
    green: { border: "border-green-100", bg: "bg-green-100", text: "text-green-600" },
    purple: { border: "border-purple-100", bg: "bg-purple-100", text: "text-purple-600" },
  } as const

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div
              className="relative py-24 bg-cover bg-center"
              style={{ backgroundImage: "url('/banner-cars.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative container mx-auto px-6 text-center text-white">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                <Car className="h-4 w-4" /> Dịch vụ cho thuê xe hàng đầu
              </div>

              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent mb-6 drop-shadow-lg">
                Trải Nghiệm Dịch Vụ Thuê Xe Cao Cấp
              </h1>

              <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                Chúng tôi mang đến bộ sưu tập xe đa dạng từ sedan sang trọng, SUV tiện nghi cho đến
                dòng xe điện hiện đại. Tất cả đều được bảo dưỡng định kỳ, thủ tục nhanh gọn và dịch vụ
                tận tâm.
              </p>

              {loadMode === "search" && urlSearch.hasSearch && (
                  <div className="mx-auto max-w-3xl text-sm text-gray-100/90 bg-white/10 border border-white/15 rounded-xl px-4 py-3 mb-8">
                    Đang hiển thị xe theo lịch trình:
                    <span className="font-semibold"> {urlSearch.pickupLocation}</span> →
                    <span className="font-semibold"> {urlSearch.returnLocation}</span>,{" "}
                    <span className="font-semibold">
                  {urlSearch.pickupDate} {urlSearch.pickupTime}
                </span>{" "}
                    →{" "}
                    <span className="font-semibold">
                  {urlSearch.returnDate} {urlSearch.returnTime}
                </span>
                  </div>
              )}

              {/* Stats Cards */}
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  {
                    count: gasolineCars.length,
                    label: "Xe Xăng",
                    color: "blue" as const,
                    icon: <Droplets className="h-6 w-6 text-blue-600" />,
                    sub: "Tiết kiệm & Tin cậy",
                  },
                  {
                    count: electricCars.length,
                    label: "Xe Điện",
                    color: "green" as const,
                    icon: <Zap className="h-6 w-6 text-green-600" />,
                    sub: "Thân thiện môi trường",
                  },
                  {
                    count: cars.length,
                    label: "Tổng Xe",
                    color: "purple" as const,
                    icon: <Car className="h-6 w-6 text-purple-600" />,
                    sub: "Đa dạng lựa chọn",
                  },
                ].map((item, i) => {
                  const s = statStyles[item.color]
                  return (
                      <div
                          key={i}
                          className={`bg-white/80 backdrop-blur-md border-2 ${s.border} rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all duration-300 min-w-[200px]`}
                      >
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <div className={`p-3 ${s.bg} rounded-full`}>{item.icon}</div>
                          <div>
                            <div className={`text-2xl font-bold ${s.text}`}>{item.count}</div>
                            <div className="text-sm text-gray-700 font-medium">{item.label}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">{item.sub}</div>
                      </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 p-8 mb-10">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                <Input
                    placeholder="Tìm kiếm xe theo tên, hãng hoặc loại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-lg"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <Tabs value={selectedFuelType} onValueChange={setSelectedFuelType}>
                  <TabsList className="grid grid-cols-3 bg-gray-100 rounded-xl p-1">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="gasoline">
                      <Droplets className="h-4 w-4 mr-1" /> Xăng
                    </TabsTrigger>
                    <TabsTrigger value="electric">
                      <Zap className="h-4 w-4 mr-1" /> Điện
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 h-12 border-gray-200">
                    <SelectValue placeholder="Loại xe" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      {loadingTypes ? "Đang tải..." : "Tất cả loại xe"}
                    </SelectItem>

                    {carTypes.map((t) => (
                        <SelectItem key={t.carTypeId} value={t.typeName}>
                          {t.typeName}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger className="w-48 h-12 border-gray-200">
                    <SelectValue placeholder="Khoảng giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả giá</SelectItem>
                    <SelectItem value="under-800k">Dưới 800k/ngày</SelectItem>
                    <SelectItem value="800k-1200k">800k - 1.2M/ngày</SelectItem>
                    <SelectItem value="over-1200k">Trên 1.2M/ngày</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedSeats} onValueChange={setSelectedSeats}>
                  <SelectTrigger className="w-40 h-12 border-gray-200">
                    <SelectValue placeholder="Số chỗ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="4">4 chỗ</SelectItem>
                    <SelectItem value="5">5 chỗ</SelectItem>
                    <SelectItem value="7">7 chỗ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Anchor */}
          <div ref={resultsRef} />

          {/* Car List: Carousel 3 xe / dịch 1 xe */}
          {loading ? (
              <div className="text-center py-20 text-gray-500">Đang tải...</div>
          ) : filteredCars.length > 0 ? (
              // OUTER: không overflow-hidden để nút ra ngoài được
              <div className="relative">
                {/* Arrow Left (đặt ở outer) */}
                <button
                    type="button"
                    onClick={() => {
                      setIndex((i) => Math.max(0, i - 1))
                      scrollToResults()
                    }}
                    disabled={index === 0}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-30
        h-12 w-12 rounded-full border bg-white/90 shadow-lg backdrop-blur
        flex items-center justify-center transition
        ${index === 0 ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}`}
                    aria-label="Trước"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>

                {/* Arrow Right (đặt ở outer) */}
                <button
                    type="button"
                    onClick={() => {
                      setIndex((i) => Math.min(maxIndex, i + 1))
                      scrollToResults()
                    }}
                    disabled={index >= maxIndex}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-30
        h-12 w-12 rounded-full border bg-white/90 shadow-lg backdrop-blur
        flex items-center justify-center transition
        ${index >= maxIndex ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}`}
                    aria-label="Sau"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>

                {/* VIEWPORT: chỉ viewport mới overflow-hidden */}
                <div className="overflow-hidden">
                  {/* Track: flex 1 hàng, dịch bằng translateX */}
                  <div
                      ref={trackRef}
                      className="flex gap-8 transition-transform duration-500 ease-out will-change-transform"
                      style={{ transform: `translate3d(-${index * stepPx}px, 0, 0)` }}
                  >
                    {filteredCars.map((car, i) => (
                        <div
                            key={car.carId}
                            ref={i === 0 ? firstItemRef : null}
                            className="shrink-0 basis-[calc((100%-4rem)/3)]"
                        >
                          <CarCard car={car} viewMode={"grid"} />
                        </div>
                    ))}
                  </div>
                </div>

                {/* Dots theo index (tùy thích) */}
                {maxIndex > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                          <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setIndex(i)
                                scrollToResults()
                              }}
                              className={`h-2.5 w-2.5 rounded-full transition ${
                                  i === index ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
                              }`}
                              aria-label={`Vị trí ${i + 1}`}
                          />
                      ))}
                    </div>
                )}
              </div>
          ) : (
              <div className="text-center py-20 text-gray-500">Không tìm thấy xe phù hợp</div>
          )}
        </div>
      </div>
  )
}
