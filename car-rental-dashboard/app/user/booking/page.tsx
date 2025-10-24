"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Step1CarSelection from "./Step1CarSelection"
import Step2RentalInfo from "./Step2RentalInfo"
import Step3PersonalInfo from "./Step3PersonalInfo"
import Step4Payment from "./Step4Payment"
import { carApi, CarItem, BookingPreviewDTO } from "@/src/services/user/apiBookingUserService "
import RequireLogin from "@/components/common/RequireLogin"
import { motion, AnimatePresence } from "framer-motion"


function Stepper({ step }: { step: number }) {
  const steps = [
    { id: 1, label: "Chọn xe" },
    { id: 2, label: "Thông tin thuê" },
    { id: 3, label: "Thông tin cá nhân" },
    { id: 4, label: "Thanh toán" },
  ]

  const progress = ((step - 1) / (steps.length - 1)) * 100

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <h2 className="text-2xl font-bold text-sky-700 mb-8 flex items-center justify-center">
        🚗 Quy trình đặt xe
      </h2>

      {/* Connector line */}
      <div className="relative flex justify-between items-center">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded"></div>

        {/* Progress line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-sky-500 rounded transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>

        {/* Steps */}
        {steps.map((s) => {
          const isActive = step === s.id
          const isDone = step > s.id

          return (
            <div key={s.id} className="flex flex-col items-center z-10">
              {/* Circle */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-semibold transition-all duration-300
                ${isActive
                    ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg scale-110"
                    : isDone
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white border-2 border-gray-300 text-gray-500"}
                `}
              >
                {isDone ? "✓" : s.id}
              </div>
              {/* Label */}
              <span
                className={`mt-3 text-sm ${isActive
                  ? "text-sky-700 font-bold"
                  : isDone
                    ? "text-green-600"
                    : "text-gray-500"
                  }`}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}



export default function BookingPage() {
  const searchParams = useSearchParams()
  const carId = searchParams.get("carId")

  const [step, setStep] = useState(1)
  const [selectedCar, setSelectedCar] = useState<CarItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const [formData, setFormData] = useState({
    pickupLocation: "",
    returnLocation: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
    licenseNumber: "",
    notes: "",
  })

  const [preview, setPreview] = useState<BookingPreviewDTO | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) setIsAuthenticated(false)
  }, [])

  useEffect(() => {
    if (!carId) {
      setLoading(false)
      return
    }
    carApi
      .getCarById(Number(carId))
      .then(setSelectedCar)
      .catch(() => setSelectedCar(null))
      .finally(() => setLoading(false))
  }, [carId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, 4))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  if (!isAuthenticated) return <RequireLogin />
  if (loading) return <p className="text-center py-10">⏳ Đang tải dữ liệu xe...</p>
  if (!selectedCar) return <p className="text-center py-10">❌ Không tìm thấy xe</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      {/* Stepper */}
      <Stepper step={step} />

      {/* Content + animation */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Step1CarSelection selectedCar={selectedCar} nextStep={nextStep} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Step2RentalInfo
                selectedCar={selectedCar}
                formData={formData}
                handleInputChange={handleInputChange}
                setPreview={setPreview}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Step3PersonalInfo
                selectedCar={selectedCar}
                formData={formData}
                handleInputChange={handleInputChange}
                preview={preview}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Step4Payment
                selectedCar={selectedCar}
                formData={formData}
                preview={preview}
                prevStep={prevStep}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
