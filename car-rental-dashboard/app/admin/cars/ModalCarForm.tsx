// "use client"

// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui-admin/dialog"
// import { Input } from "@/components/ui-admin/input"
// import { Label } from "@/components/ui-admin/label"
// import { Button } from "@/components/ui-admin/button"
// import { brandApi, type Brand } from "@/src/services/brandApi"
// import { carTypeApi, type CarType } from "@/src/services/carTypeApi"
// import { carsApi, type Car } from "@/src/services/carsApi"

// // ✅ Schema validate (theo CarRequestDTO)
// const schema = z.object({
//     carName: z.string().min(1, "Tên xe không được để trống"),
//     quantity: z.preprocess((v) => Number(v), z.number().min(1, "Số lượng phải >= 1")),
//     location: z.string().min(1, "Vị trí không được để trống"),
//     engine: z.string().min(1, "Động cơ không được để trống"),
//     fuelType: z.string().min(1, "Nhiên liệu không được để trống"),
//     seatCount: z.preprocess((v) => Number(v), z.number().min(1, "Số ghế phải >= 1")),
//     year: z.preprocess((v) => Number(v), z.number().min(1900, "Năm sản xuất không hợp lệ")),
//     color: z.string().min(1, "Màu sắc không được để trống"),
//     licensePlate: z.string().min(1, "Biển số không được để trống"),

//     // ✅ Fix: ép kiểu và tránh NaN
//     brandId: z.preprocess(
//         (v) => (v === "" ? undefined : Number(v)),
//         z.number({ invalid_type_error: "Phải chọn thương hiệu" }).min(1, "Phải chọn thương hiệu")
//     ),
//     carTypeId: z.preprocess(
//         (v) => (v === "" ? undefined : Number(v)),
//         z.number({ invalid_type_error: "Phải chọn loại xe" }).min(1, "Phải chọn loại xe")
//     ),

//     status: z.string().min(1, "Phải chọn trạng thái"),
// })


// type FormValues = z.infer<typeof schema>

// type Props = {
//     car: Car | null
//     onClose: () => void
//     onSaved: () => void
// }

// export function ModalCarForm({ car, onClose, onSaved }: Props) {
//     const [brands, setBrands] = useState<Brand[]>([])
//     const [carTypes, setCarTypes] = useState<CarType[]>([])
//     const [files, setFiles] = useState<File[]>([])

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm<FormValues>({
//         resolver: zodResolver(schema),
//         defaultValues: car
//             ? {
//                 status: car.status,
//                 carName: car.carName,
//                 quantity: car.quantity,
//                 location: car.location,
//                 engine: car.engine,
//                 fuelType: car.fuelType,
//                 seatCount: car.seatCount,
//                 year: car.year,
//                 color: car.color,
//                 licensePlate: car.licensePlate,
//                 brandId: car.brandId,
//                 carTypeId: car.carTypeId,
//             }
//             : {
//                 status: "AVAILABLE",
//                 carName: "",
//                 quantity: 1,
//                 location: "",
//                 engine: "",
//                 fuelType: "",
//                 seatCount: 4,
//                 year: new Date().getFullYear(),
//                 color: "",
//                 licensePlate: "",
//                 brandId: 0,
//                 carTypeId: 0,
//             },
//     })

//     // Load brand + carType
//     useEffect(() => {
//         Promise.all([brandApi.getAll(), carTypeApi.getAll()])
//             .then(([brandsData, carTypesData]) => {
//                 setBrands(brandsData)
//                 setCarTypes(carTypesData)
//             })
//             .catch((err) => console.error("API error:", err))
//     }, [])

//     // ✅ Submit chuẩn DTO
//     const onSubmit = async (data: FormValues) => {
//         const fd = new FormData()
//         fd.append("status", data.status)
//         fd.append("carName", data.carName)
//         fd.append("quantity", String(data.quantity))
//         fd.append("location", data.location)
//         fd.append("engine", data.engine)
//         fd.append("fuelType", data.fuelType)
//         fd.append("seatCount", String(data.seatCount))
//         fd.append("year", String(data.year))
//         fd.append("color", data.color)
//         fd.append("licensePlate", data.licensePlate)
//         fd.append("brandId", String(data.brandId))
//         fd.append("carTypeId", String(data.carTypeId))

//         files.forEach((file) => fd.append("images", file))

//         try {
//             if (car) {
//                 await carsApi.update(car.id, fd)
//             } else {
//                 await carsApi.create(fd)
//             }
//             onSaved()
//             onClose()
//         } catch (err) {
//             console.error("Lỗi khi submit:", err)
//         }
//     }

//     return (
//         <Dialog open onOpenChange={onClose}>
//             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                     <DialogTitle>{car ? "Chỉnh sửa xe" : "Thêm xe mới"}</DialogTitle>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 mt-4">
//                     {/* Car name */}
//                     <div>
//                         <Label>Tên xe</Label>
//                         <Input {...register("carName")} />
//                         {errors.carName && <p className="text-red-500 text-sm">{errors.carName.message}</p>}
//                     </div>

//                     {/* Quantity */}
//                     <div>
//                         <Label>Số lượng</Label>
//                         <Input type="number" {...register("quantity")} />
//                         {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
//                     </div>

//                     {/* Location */}
//                     <div>
//                         <Label>Vị trí</Label>
//                         <Input {...register("location")} />
//                         {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
//                     </div>

//                     {/* Status */}
//                     <div>
//                         <Label>Trạng thái</Label>
//                         <select {...register("status")} className="border rounded w-full p-2">
//                             <option value="">-- Chọn trạng thái --</option>
//                             <option value="AVAILABLE">AVAILABLE</option>
//                             <option value="RENTED">RENTED</option>
//                             <option value="MAINTENANCE">MAINTENANCE</option>
//                         </select>
//                         {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
//                     </div>

//                     <select {...register("brandId")} className="border rounded w-full p-2">
//                         <option value="">-- Chọn thương hiệu --</option>
//                         {brands.map((b) => (
//                             <option key={b.brandId} value={String(b.brandId)}>
//                                 {b.brandName}
//                             </option>
//                         ))}
//                     </select>

//                     <select {...register("carTypeId")} className="border rounded w-full p-2">
//                         <option value="">-- Chọn loại xe --</option>
//                         {carTypes.map((ct) => (
//                             <option key={ct.carTypeId} value={String(ct.carTypeId)}>
//                                 {ct.typeName}
//                             </option>
//                         ))}
//                     </select>


//                     {/* Engine */}
//                     <div>
//                         <Label>Động cơ</Label>
//                         <Input {...register("engine")} />
//                         {errors.engine && <p className="text-red-500 text-sm">{errors.engine.message}</p>}
//                     </div>

//                     {/* Fuel type */}
//                     <div>
//                         <Label>Nhiên liệu</Label>
//                         <Input {...register("fuelType")} />
//                         {errors.fuelType && <p className="text-red-500 text-sm">{errors.fuelType.message}</p>}
//                     </div>

//                     {/* Seat count */}
//                     <div>
//                         <Label>Số ghế</Label>
//                         <Input type="number" {...register("seatCount")} />
//                         {errors.seatCount && <p className="text-red-500 text-sm">{errors.seatCount.message}</p>}
//                     </div>

//                     {/* Year */}
//                     <div>
//                         <Label>Năm sản xuất</Label>
//                         <Input type="number" {...register("year")} />
//                         {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
//                     </div>

//                     {/* Color */}
//                     <div>
//                         <Label>Màu sắc</Label>
//                         <Input {...register("color")} />
//                         {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}
//                     </div>

//                     {/* License plate */}
//                     <div>
//                         <Label>Biển số</Label>
//                         <Input {...register("licensePlate")} />
//                         {errors.licensePlate && <p className="text-red-500 text-sm">{errors.licensePlate.message}</p>}
//                     </div>

//                     {/* Images */}
//                     <div className="col-span-2">
//                         <Label>Ảnh</Label>
//                         <Input
//                             type="file"
//                             multiple
//                             accept="image/*"
//                             onChange={(e) => setFiles(Array.from(e.target.files || []))}
//                         />
//                     </div>

//                     {/* Buttons */}
//                     <div className="col-span-2 flex justify-end gap-2 mt-4">
//                         <Button variant="outline" type="button" onClick={onClose}>
//                             Hủy
//                         </Button>
//                         <Button type="submit">{car ? "Cập nhật" : "Thêm mới"}</Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }
