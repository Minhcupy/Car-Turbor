"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui-admin/card"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui-admin/tabs"
import { Badge } from "@/components/ui-admin/badge"
import { Car, Navigation, Wrench, MapPin } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { fleetApi } from "@/src/services/fleetApi"

// ✅ Fix icon mặc định của Leaflet
const defaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [28, 42],
  iconAnchor: [14, 42],
})
L.Marker.prototype.options.icon = defaultIcon

// 🔹 Custom icon theo ảnh xe
const carIcon = (imageUrl: string) =>
  L.icon({
    iconUrl: `http://localhost:8080${imageUrl}`,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    className: "rounded-full border-2 border-white shadow-md",
  })

// Kiểu dữ liệu từ API
interface FleetOverview {
  totalCars: number
  rentedCars: number
  maintenanceCars: number
  utilization: number
}
interface FleetCar {
  carId: number
  carName: string
  imageUrl: string
  location: string
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE"
}
interface CarLocation {
  carId: number
  carName: string
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE"
  latitude: number | null
  longitude: number | null
  imageUrl?: string
}

export default function FleetPage() {
  const [overview, setOverview] = useState<FleetOverview | null>(null)
  const [cars, setCars] = useState<FleetCar[]>([])
  const [tracking, setTracking] = useState<CarLocation[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fleetApi.getOverview().then(setOverview).catch(console.error)
    fleetApi.getCars().then(setCars).catch(console.error)
    fleetApi.getTracking().then(setTracking).catch(console.error)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "default"
      case "RENTED": return "secondary"
      case "MAINTENANCE": return "destructive"
      default: return "outline"
    }
  }

  // 🔹 Pie chart data từ overview
  const chartData = overview ? [
    { name: "Available", value: overview.totalCars - overview.rentedCars - overview.maintenanceCars },
    { name: "Rented", value: overview.rentedCars },
    { name: "Maintenance", value: overview.maintenanceCars },
  ] : []
  const COLORS = ["#22c55e", "#3b82f6", "#f97316"]

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          🚘 Fleet Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Quản lý & theo dõi đội xe theo thời gian thực
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-2xl w-fit mx-auto shadow-sm">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="tracking">Theo dõi</TabsTrigger>
          <TabsTrigger value="utilization">Sử dụng</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <TabsContent value="overview" forceMount>
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-10"
              >
                {/* Thống kê */}
                {overview && (
                  <div className="grid gap-6 md:grid-cols-3">
                    {[
                      {
                        title: "Tổng số xe",
                        value: overview.totalCars,
                        icon: <Navigation className="h-6 w-6 text-slate-600" />,
                      },
                      {
                        title: "Đang cho thuê",
                        value: overview.rentedCars,
                        icon: <Car className="h-6 w-6 text-blue-600" />,
                      },
                      {
                        title: "Đang bảo dưỡng",
                        value: overview.maintenanceCars,
                        icon: <Wrench className="h-6 w-6 text-orange-600" />,
                      },
                    ].map((stat, i) => (
                      <Card key={i} className="bg-white border shadow-md rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="text-base font-medium">{stat.title}</CardTitle>
                          {stat.icon}
                        </CardHeader>
                        <CardContent>
                          <div className="text-4xl font-bold">{stat.value}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Danh sách xe */}
                <div className="grid gap-6 md:grid-cols-3">
                  {cars.map((vehicle) => (
                    <Card key={vehicle.carId} className="overflow-hidden hover:shadow-2xl rounded-2xl border bg-white">
                      <div className="aspect-video relative">
                        <Image
                          src={`http://localhost:8080${vehicle.imageUrl}`}
                          alt={vehicle.carName}
                          fill
                          className="object-cover rounded-t-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <Badge className="absolute top-2 right-2" variant={getStatusBadge(vehicle.status) as any}>
                          {vehicle.status}
                        </Badge>
                      </div>
                      <CardContent className="pt-3">
                        <h3 className="font-semibold text-lg">{vehicle.carName}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {vehicle.location}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          )}

          {/* Tab 2: Tracking Map */}
          {activeTab === "tracking" && (
            <TabsContent value="tracking" forceMount>
              <div className="h-[600px] w-full">
                <MapContainer center={[21.0278, 105.8342]} zoom={12} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {tracking.map((car) =>
                    car.latitude != null && car.longitude != null ? (
                      <Marker
                        key={car.carId}
                        position={[car.latitude, car.longitude]}
                        icon={car.imageUrl ? carIcon(car.imageUrl) : defaultIcon}
                      >
                        <Popup>
                          <div className="flex items-center gap-2">
                            {car.imageUrl && (
                              <img
                                src={`http://localhost:8080${car.imageUrl}`}
                                alt={car.carName}
                                className="w-12 h-8 object-cover rounded"
                              />
                            )}
                            <div>
                              <strong>{car.carName}</strong><br />
                              <Badge variant={getStatusBadge(car.status)}>{car.status}</Badge>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ) : null
                  )}
                </MapContainer>
              </div>
            </TabsContent>
          )}

          {/* Tab 3: Utilization */}
          {activeTab === "utilization" && (
            <TabsContent value="utilization" forceMount>
              <div className="h-[400px] flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
