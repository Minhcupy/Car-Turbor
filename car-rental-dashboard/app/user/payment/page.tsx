"use client"

import { useState } from "react"
import { CreditCard, Shield, Clock, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock booking data - in real app this would come from booking context/state
  const bookingData = {
    car: {
      name: "Mercedes C-Class",
      category: "Sedan Cao Cấp",
      image: "/mercedes-c-class-sedan.jpg",
      pricePerDay: 1200000,
    },
    rental: {
      pickupDate: "2024-01-15",
      returnDate: "2024-01-18",
      pickupLocation: "Sân bay Tân Sơn Nhất",
      returnLocation: "Sân bay Tân Sơn Nhất",
      days: 3,
    },
    pricing: {
      basePrice: 3600000,
      insurance: 300000,
      tax: 390000,
      total: 4290000,
    },
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsProcessing(false)
    // Redirect to success page or show success message
  }

  return (
    <div className="min-h-screen bg-sky-50">
      {/* Header */}
      <nav className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Car<span className="text-sky-400">Book</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/cars" className="flex items-center text-sky-400 hover:text-sky-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  ✓
                </div>
                <span className="ml-2 text-gray-600">Chọn xe</span>
              </div>
              <div className="w-8 h-1 bg-sky-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  ✓
                </div>
                <span className="ml-2 text-gray-600">Thông tin</span>
              </div>
              <div className="w-8 h-1 bg-sky-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <span className="ml-2 text-sky-600 font-semibold">Thanh toán</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card className="border-sky-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <CreditCard className="h-6 w-6 mr-2 text-sky-500" />
                    Thông Tin Thanh Toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-base font-semibold text-gray-800 mb-4 block">Phương thức thanh toán</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentMethod === "credit-card"
                            ? "border-sky-500 bg-sky-50"
                            : "border-gray-200 hover:border-sky-300"
                        }`}
                        onClick={() => setPaymentMethod("credit-card")}
                      >
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-6 w-6 text-sky-500" />
                          <span className="font-medium">Thẻ tín dụng</span>
                        </div>
                      </div>
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentMethod === "bank-transfer"
                            ? "border-sky-500 bg-sky-50"
                            : "border-gray-200 hover:border-sky-300"
                        }`}
                        onClick={() => setPaymentMethod("bank-transfer")}
                      >
                        <div className="flex items-center space-x-3">
                          <Shield className="h-6 w-6 text-sky-500" />
                          <span className="font-medium">Chuyển khoản</span>
                        </div>
                      </div>
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentMethod === "cash" ? "border-sky-500 bg-sky-50" : "border-gray-200 hover:border-sky-300"
                        }`}
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="h-6 w-6 text-sky-500" />
                          <span className="font-medium">Tiền mặt</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Credit Card Form */}
                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Số thẻ</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                          <Input id="expiryDate" placeholder="MM/YY" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Tên trên thẻ</Label>
                        <Input id="cardName" placeholder="NGUYEN VAN A" className="mt-1" />
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Info */}
                  {paymentMethod === "bank-transfer" && (
                    <div className="bg-sky-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Thông tin chuyển khoản</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Ngân hàng:</strong> Vietcombank
                        </p>
                        <p>
                          <strong>Số tài khoản:</strong> 1234567890
                        </p>
                        <p>
                          <strong>Chủ tài khoản:</strong> CONG TY TNHH CARBOOK
                        </p>
                        <p>
                          <strong>Nội dung:</strong> Thanh toan thue xe [Mã đơn hàng]
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Cash Payment Info */}
                  {paymentMethod === "cash" && (
                    <div className="bg-sky-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Thanh toán tiền mặt</h4>
                      <p className="text-sm text-gray-600">
                        Bạn sẽ thanh toán bằng tiền mặt khi nhận xe. Vui lòng chuẩn bị đủ số tiền theo hóa đơn.
                      </p>
                    </div>
                  )}

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Địa chỉ thanh toán</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Họ</Label>
                        <Input id="firstName" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Tên</Label>
                        <Input id="lastName" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Địa chỉ</Label>
                      <Input id="address" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Thành phố</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thành phố" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                            <SelectItem value="hn">Hà Nội</SelectItem>
                            <SelectItem value="dn">Đà Nẵng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="district">Quận/Huyện</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="q1">Quận 1</SelectItem>
                            <SelectItem value="q2">Quận 2</SelectItem>
                            <SelectItem value="q3">Quận 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Mã bưu điện</Label>
                        <Input id="zipCode" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-sky-100 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-gray-800">Tóm Tắt Đơn Hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Car Info */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={bookingData.car.image || "/placeholder.svg"}
                      alt={bookingData.car.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{bookingData.car.name}</h4>
                      <p className="text-sm text-gray-600">{bookingData.car.category}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Rental Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nhận xe:</span>
                      <span className="font-medium">{bookingData.rental.pickupDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trả xe:</span>
                      <span className="font-medium">{bookingData.rental.returnDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Địa điểm:</span>
                      <span className="font-medium text-right">{bookingData.rental.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số ngày:</span>
                      <span className="font-medium">{bookingData.rental.days} ngày</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá thuê ({bookingData.rental.days} ngày):</span>
                      <span>{bookingData.pricing.basePrice.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bảo hiểm:</span>
                      <span>{bookingData.pricing.insurance.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thuế & phí:</span>
                      <span>{bookingData.pricing.tax.toLocaleString()}đ</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Tổng cộng:</span>
                    <span className="text-sky-600">{bookingData.pricing.total.toLocaleString()}đ</span>
                  </div>

                  {/* Security Features */}
                  <div className="bg-sky-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-sky-700">
                      <Shield className="h-4 w-4" />
                      <span>Thanh toán được bảo mật SSL</span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <Button
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Xác Nhận Thanh Toán</span>
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Bằng cách thanh toán, bạn đồng ý với
                    <a href="#" className="text-sky-500 hover:underline">
                      {" "}
                      Điều khoản dịch vụ{" "}
                    </a>
                    và
                    <a href="#" className="text-sky-500 hover:underline">
                      {" "}
                      Chính sách bảo mật
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
