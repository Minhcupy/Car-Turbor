"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { brandApi, type BrandDTO, type BrandPage } from "@/src/services/brandApi"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function BrandsPage() {
    // <TabsContent value="details" className="space-y-4">
    //     <Card>
    //         <CardHeader>
    //             <CardTitle>Car Details</CardTitle>
    //             <CardDescription>View and edit detailed specifications for selected vehicles.</CardDescription>
    //         </CardHeader>
    //         <CardContent>
    //             <div className="grid md:grid-cols-2 gap-6">
    //                 <div className="space-y-4">
    //                     <Select>
    //                         <SelectTrigger>
    //                             <SelectValue placeholder="Select a car to view details" />
    //                         </SelectTrigger>
    //                         <SelectContent>
    //                             {cars.map((car) => (
    //                                 <SelectItem key={car.id} value={car.id.toString()}>
    //                                     {car.name}
    //                                 </SelectItem>
    //                             ))}
    //                         </SelectContent>
    //                     </Select>

    //                     {cars[0] && (
    //                         <div className="space-y-3">
    //                             <div className="aspect-video relative rounded-lg overflow-hidden">
    //                                 <Image
    //                                     src={cars[0].image || "/placeholder.svg"}
    //                                     alt={cars[0].name}
    //                                     fill
    //                                     className="object-cover"
    //                                 />
    //                             </div>
    //                             <div className="grid grid-cols-2 gap-4 text-sm">
    //                                 <div>
    //                                     <span className="font-medium">Year:</span> {cars[0].year}
    //                                 </div>
    //                                 <div>
    //                                     <span className="font-medium">Seats:</span> {cars[0].seats}
    //                                 </div>
    //                                 <div>
    //                                     <span className="font-medium">Transmission:</span> {cars[0].transmission}
    //                                 </div>
    //                                 <div>
    //                                     <span className="font-medium">Fuel:</span> {cars[0].fuel}
    //                                 </div>
    //                                 <div>
    //                                     <span className="font-medium">Mileage:</span> {cars[0].mileage?.toLocaleString()} miles
    //                                 </div>
    //                                 <div>
    //                                     <span className="font-medium">Status:</span>
    //                                     <Badge
    //                                         className="ml-2"
    //                                         variant={
    //                                             cars[0].status === "available"
    //                                                 ? "default"
    //                                                 : cars[0].status === "rented"
    //                                                     ? "secondary"
    //                                                     : "destructive"
    //                                         }
    //                                     >
    //                                         {cars[0].status}
    //                                     </Badge>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     )}
    //                 </div>

    //                 <div className="space-y-4">
    //                     <h3 className="font-semibold">Description</h3>
    //                     <p className="text-sm text-muted-foreground">{cars[0]?.description}</p>

    //                     <div className="space-y-2">
    //                         <h3 className="font-semibold">Pricing</h3>
    //                         <div className="grid grid-cols-2 gap-4">
    //                             <div className="p-3 border rounded-lg">
    //                                 <p className="text-sm text-muted-foreground">Per Day</p>
    //                                 <p className="text-lg font-semibold">${cars[0]?.pricePerDay}</p>
    //                             </div>
    //                             <div className="p-3 border rounded-lg">
    //                                 <p className="text-sm text-muted-foreground">Per Hour</p>
    //                                 <p className="text-lg font-semibold">${cars[0]?.pricePerHour}</p>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     <div className="flex space-x-2">
    //                         <Button variant="outline" className="flex-1 bg-transparent">
    //                             Change Status
    //                         </Button>
    //                         <Button className="flex-1">Edit Details</Button>
    //                     </div>
    //                 </div>
    //             </div>
    //         </CardContent>
    //     </Card>
    // </TabsContent>

}
