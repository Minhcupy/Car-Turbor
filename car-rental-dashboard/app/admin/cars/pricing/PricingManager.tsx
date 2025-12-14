// src/app/admin/cars/[id]/pricing/PricingManager.tsx
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { pricingApi, type Pricing } from "@/src/services/pricingApi"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui-admin/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { Trash2, Pencil, PlusCircle } from "lucide-react"

// Schema validate
const schema = z.object({
    unit: z.string().min(1, "Đơn vị không được để trống"),
    price: z.preprocess(
        (v) => Number(v),
        z.number().positive("Giá phải > 0")
    ),
})

type FormValues = z.infer<typeof schema>

type Props = {
    carId: number
}

export function PricingManager({ carId }: Props) {
    const [pricingList, setPricingList] = useState<Pricing[]>([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<Pricing | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            unit: "DAY",
            price: 0,
        },
    })

    const loadData = async () => {
        setLoading(true)
        try {
            const data = await pricingApi.getByCar(carId)
            setPricingList(data)
        } catch (e) {
            console.error("Load pricing error:", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (carId) {
            loadData()
        }
    }, [carId])

    const openCreate = () => {
        setEditing(null)
        reset({
            unit: "DAY",
            price: 0,
        })
        setOpen(true)
    }

    const openEdit = (p: Pricing) => {
        setEditing(p)
        reset({
            unit: p.unit,
            price: p.price,
        })
        setOpen(true)
    }

    const onSubmit = async (data: FormValues) => {
        const payload = {
            unit: data.unit,
            price: data.price,
            carId,
        }

        try {
            if (editing) {
                await pricingApi.update(editing.pricingId, payload)
            } else {
                await pricingApi.create(payload)
            }
            await loadData()
            setOpen(false)
        } catch (e) {
            console.error("Save pricing error:", e)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn chắc chắn muốn xóa giá này?")) return
        try {
            await pricingApi.delete(id)
            await loadData()
        } catch (e) {
            console.error("Delete pricing error:", e)
        }
    }

    return (
        <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Giá thuê xe</CardTitle>
                <Button size="sm" onClick={openCreate}>
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Thêm giá
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Đang tải giá...</p>
                ) : pricingList.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Chưa có cấu hình giá nào cho xe này.
                    </p>
                ) : (
                    <table className="w-full text-sm border rounded-md overflow-hidden">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Đơn vị</th>
                            <th className="px-4 py-2 text-left">Giá (VND)</th>
                            <th className="px-4 py-2 text-center w-[120px]">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pricingList.map((p) => (
                            <tr key={p.pricingId} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{p.unit}</td>
                                <td className="px-4 py-2">
                                    {p.price.toLocaleString("vi-VN")}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => openEdit(p)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(p.pricingId)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </CardContent>

            {/* Modal thêm / sửa */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? "Chỉnh sửa giá" : "Thêm giá mới"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                        {/* Unit */}
                        <div>
                            <Label>Đơn vị</Label>
                            <select
                                {...register("unit")}
                                className="border rounded w-full p-2 mt-1"
                            >
                                <option value="DAY">Theo ngày (DAY)</option>
                                <option value="HOUR">Theo giờ (HOUR)</option>
                                <option value="WEEK">Theo tuần (WEEK)</option>
                                <option value="MONTH">Theo tháng (MONTH)</option>
                            </select>
                            {errors.unit && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.unit.message}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <Label>Giá (VND)</Label>
                            <Input type="number" step="1000" {...register("price")} />
                            {errors.price && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="submit">
                                {editing ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
