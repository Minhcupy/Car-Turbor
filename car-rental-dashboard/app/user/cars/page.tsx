"use client"

import { useEffect, useState } from "react"
import {
  Car,
  Search,
  Droplets,
  Zap,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CarCard from "./CarCard"
import type { CarUserDTO } from "@/src/services/user/carApi"
import { getAllCars } from "@/src/services/user/carApi"

export default function CarsPage() {
  const [cars, setCars] = useState<CarUserDTO[]>([])
  const [loading, setLoading] = useState(true)

  // Bộ lọc
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [selectedSeats, setSelectedSeats] = useState("all")
  const [selectedFuelType, setSelectedFuelType] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Fetch API khi load trang
  useEffect(() => {
    async function fetchCars() {
      try {
        const data = await getAllCars()
        setCars(data)
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách xe:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [])

  // Lọc dữ liệu
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.typeName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" || car.typeName.includes(selectedCategory)

    const matchesSeats =
      selectedSeats === "all" || car.seats.toString() === selectedSeats

    const matchesFuelType =
      selectedFuelType === "all" || car.fuelType === selectedFuelType

    let matchesPrice = true
    if (selectedPriceRange !== "all" && car.price !== null) {
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

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesSeats &&
      matchesFuelType
    )
  })

  const gasolineCars = cars.filter((car) => car.fuelType === "gasoline")
  const electricCars = cars.filter((car) => car.fuelType === "electric")

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
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed">
              Chúng tôi mang đến bộ sưu tập xe đa dạng từ sedan sang trọng, SUV
              tiện nghi cho đến dòng xe điện hiện đại. Tất cả đều được bảo dưỡng
              định kỳ, thủ tục nhanh gọn và dịch vụ tận tâm.
            </p>

            {/* Stats Cards */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                {
                  count: gasolineCars.length,
                  label: "Xe Xăng",
                  color: "blue",
                  icon: <Droplets className="h-6 w-6 text-blue-600" />,
                  sub: "Tiết kiệm & Tin cậy",
                },
                {
                  count: electricCars.length,
                  label: "Xe Điện",
                  color: "green",
                  icon: <Zap className="h-6 w-6 text-green-600" />,
                  sub: "Thân thiện môi trường",
                },
                {
                  count: cars.length,
                  label: "Tổng Xe",
                  color: "purple",
                  icon: <Car className="h-6 w-6 text-purple-600" />,
                  sub: "Đa dạng lựa chọn",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`bg-white/80 backdrop-blur-md border-2 border-${item.color}-100 rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all duration-300 min-w-[200px]`}
                >
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className={`p-3 bg-${item.color}-100 rounded-full`}>
                      {item.icon}
                    </div>
                    <div>
                      <div
                        className={`text-2xl font-bold text-${item.color}-600`}
                      >
                        {item.count}
                      </div>
                      <div className="text-sm text-gray-700 font-medium">
                        {item.label}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">{item.sub}</div>
                </div>
              ))}
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

            {/* Filters */}
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
                  <SelectItem value="all">Tất cả loại xe</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
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

        {/* Car List */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Đang tải...</div>
        ) : filteredCars.length > 0 ? (
          <div
            className={`grid gap-8 ${viewMode === "grid"
              ? "md:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1 max-w-4xl mx-auto"
              }`}
          >
            {filteredCars.map((car) => (
              <CarCard key={car.carId} car={car} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            Không tìm thấy xe phù hợp
          </div>
        )}
      </div>
    </div>
  )
}
