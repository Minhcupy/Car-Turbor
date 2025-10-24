"use client"

import { useState } from "react"
import { Car, Calendar, MapPin, Clock, Phone, Star, Search, Download, Eye, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const bookings = [
  {
    id: "BK001",
    car: {
      name: "Mercedes C-Class",
      image: "/mercedes-c-class-sedan.jpg",
      licensePlate: "51A-123.45",
    },
    startDate: "2024-01-15",
    endDate: "2024-01-18",
    startTime: "08:00",
    endTime: "18:00",
    pickupLocation: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    status: "active",
    totalAmount: "3,650,000",
    bookingDate: "2024-01-10",
    owner: {
      name: "Nguyễn Văn B",
      phone: "0123 456 789",
      rating: 4.9,
    },
    notes: "Cần xe sạch sẽ cho chuyến công tác",
  },
  {
    id: "BK002",
    car: {
      name: "Toyota Camry",
      image: "/toyota-camry-sedan.png",
      licensePlate: "51B-456.78",
    },
    startDate: "2024-01-10",
    endDate: "2024-01-12",
    startTime: "09:00",
    endTime: "17:00",
    pickupLocation: "456 Lê Lợi, Quận 3, TP.HCM",
    status: "completed",
    totalAmount: "1,650,000",
    bookingDate: "2024-01-05",
    owner: {
      name: "Trần Thị C",
      phone: "0987 654 321",
      rating: 4.7,
    },
    notes: "",
    rating: 5,
    review: "Xe rất sạch sẽ, chủ xe nhiệt tình. Sẽ thuê lại lần sau!",
  },
  {
    id: "BK003",
    car: {
      name: "Honda CR-V",
      image: "/honda-crv-suv.png",
      licensePlate: "51C-789.01",
    },
    startDate: "2024-01-20",
    endDate: "2024-01-25",
    startTime: "07:00",
    endTime: "19:00",
    pickupLocation: "789 Võ Văn Tần, Quận 7, TP.HCM",
    status: "upcoming",
    totalAmount: "5,050,000",
    bookingDate: "2024-01-12",
    owner: {
      name: "Lê Văn D",
      phone: "0369 258 147",
      rating: 4.8,
    },
    notes: "Xe gia đình đi du lịch Đà Lạt",
  },
  {
    id: "BK004",
    car: {
      name: "Hyundai Accent",
      image: "/hyundai-accent-sedan.jpg",
      licensePlate: "51D-234.56",
    },
    startDate: "2024-01-05",
    endDate: "2024-01-07",
    startTime: "10:00",
    endTime: "16:00",
    pickupLocation: "321 Điện Biên Phủ, Quận 10, TP.HCM",
    status: "cancelled",
    totalAmount: "1,250,000",
    bookingDate: "2024-01-02",
    owner: {
      name: "Phạm Thị E",
      phone: "0147 852 963",
      rating: 4.5,
    },
    notes: "Hủy do thay đổi kế hoạch",
    cancelReason: "Thay đổi lịch trình đột xuất",
  },
]

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTimeRange, setSelectedTimeRange] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang thuê"
      case "completed":
        return "Hoàn thành"
      case "upcoming":
        return "Sắp tới"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus

    let matchesTimeRange = true
    if (selectedTimeRange !== "all") {
      const bookingDate = new Date(booking.bookingDate)
      const now = new Date()
      const diffTime = now.getTime() - bookingDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (selectedTimeRange) {
        case "week":
          matchesTimeRange = diffDays <= 7
          break
        case "month":
          matchesTimeRange = diffDays <= 30
          break
        case "3months":
          matchesTimeRange = diffDays <= 90
          break
      }
    }

    return matchesSearch && matchesStatus && matchesTimeRange
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-sky-500" />
              <span className="text-2xl font-bold text-gray-800">CarRental</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-sky-500 transition-colors">
                Trang Chủ
              </Link>
              <Link href="/cars" className="text-gray-700 hover:text-sky-500 transition-colors">
                Xe Cho Thuê
              </Link>
              <Link href="/bookings" className="text-sky-500 font-medium">
                Đặt Xe Của Tôi
              </Link>
              <a href="#" className="text-gray-700 hover:text-sky-500 transition-colors">
                Liên Hệ
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button className="bg-sky-500 hover:bg-sky-600 text-white">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lịch Sử Đặt Xe</h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả các chuyến đi của bạn</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-sky-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng chuyến đi</p>
                  <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                </div>
                <div className="bg-sky-100 p-3 rounded-full">
                  <Car className="h-6 w-6 text-sky-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-sky-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang thuê</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "active").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-sky-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hoàn thành</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bookings.filter((b) => b.status === "completed").length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-sky-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(
                      bookings.reduce((sum, b) => sum + Number.parseInt(b.totalAmount.replace(/,/g, "")), 0) / 1000000
                    ).toFixed(1)}
                    M
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Download className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-sky-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo mã đặt xe hoặc tên xe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-sky-200 focus:border-sky-500"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48 border-sky-200">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang thuê</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="upcoming">Sắp tới</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-48 border-sky-200">
                  <SelectValue placeholder="Thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thời gian</SelectItem>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">30 ngày qua</SelectItem>
                  <SelectItem value="3months">3 tháng qua</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="border-sky-100 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Car Image */}
                  <div className="lg:w-48 flex-shrink-0">
                    <img
                      src={booking.car.image || "/placeholder.svg"}
                      alt={booking.car.name}
                      className="w-full h-32 lg:h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">{booking.car.name}</h3>
                          <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Mã đặt xe: <span className="font-medium">{booking.id}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Biển số: <span className="font-medium">{booking.car.licensePlate}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-sky-500">{booking.totalAmount}đ</p>
                        <p className="text-sm text-gray-600">Đặt ngày {booking.bookingDate}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {booking.startDate} ({booking.startTime}) - {booking.endDate} ({booking.endTime})
                          </span>
                        </div>
                        <div className="flex items-start space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{booking.pickupLocation}</span>
                        </div>
                        {booking.notes && (
                          <div className="flex items-start space-x-2 text-sm text-gray-600">
                            <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{booking.notes}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>
                            {booking.owner.name} - {booking.owner.phone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>Chủ xe: {booking.owner.rating}/5</span>
                        </div>
                        {booking.status === "cancelled" && booking.cancelReason && (
                          <div className="text-sm text-red-600">
                            <span className="font-medium">Lý do hủy:</span> {booking.cancelReason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review Section for Completed Bookings */}
                    {booking.status === "completed" && booking.review && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-blue-800">Đánh giá của bạn:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < (booking.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-blue-700">{booking.review}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Chi tiết
                      </Button>
                      {booking.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Liên hệ chủ xe
                        </Button>
                      )}
                      {booking.status === "upcoming" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                          >
                            Sửa đặt xe
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                          >
                            Hủy đặt xe
                          </Button>
                        </>
                      )}
                      {booking.status === "completed" && !booking.review && (
                        <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
                          Đánh giá
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Tải hóa đơn
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy đặt xe nào</h3>
            <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <Link href="/cars">
              <Button className="bg-sky-500 hover:bg-sky-600 text-white">Đặt xe ngay</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
