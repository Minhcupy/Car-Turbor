"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PricingManager } from "./PricingManager"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui-admin/card"
import { carsApi, type Car } from "@/src/services/carsApi"

export default function CarPricingPage() {
    const searchParams = useSearchParams()
    const carIdParam = searchParams.get("carId")
    const id = carIdParam ? Number(carIdParam) : NaN

    const [car, setCar] = useState<Car | null>(null)

    useEffect(() => {
        if (!isNaN(id)) {
            carsApi.getById(id).then(setCar).catch(console.error)
        }
    }, [id])

    if (isNaN(id)) {
        return <p className="p-6 text-red-500">Thiếu id xe</p>
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Cấu hình giá cho xe:{" "}
                        <span className="font-bold">
              {car ? car.carName : `#${id}`}
            </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Quản lý giá theo ngày / giờ / tuần / tháng cho xe này.
                    </p>
                </CardContent>
            </Card>

            <PricingManager carId={id} />
        </div>
    )
}
