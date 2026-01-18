"use client"

import { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { ModalForm } from "@/components/ui-admin/modal-form"
import { carTypeApi, type CarTypeDTO } from "@/src/services/carTypeApi"
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui-admin/alert-dialog"

const schema = z.object({
    typeName: z.string().min(1, "Tên loại xe không được để trống"),
})
type FormValues = z.infer<typeof schema>

export default function CarTypesPage() {
    const [carTypes, setCarTypes] = useState<CarTypeDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [pageSize] = useState(5)
    const [totalPages, setTotalPages] = useState(1)

    const [openModal, setOpenModal] = useState(false)
    const [editing, setEditing] = useState<CarTypeDTO | null>(null)

    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { typeName: "" },
    })

    const fetchData = async () => {
        try {
            setLoading(true)
            const data = await carTypeApi.getPage(page, pageSize)
            setCarTypes(data.content)
            setTotalPages(data.totalPages)
        } catch (e) {
            console.error("Load car types failed:", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page])

    const handleAdd = () => {
        setEditing(null)
        reset({ typeName: "" })
        setOpenModal(true)
    }

    const handleEdit = (ct: CarTypeDTO) => {
        setEditing(ct)
        reset({ typeName: ct.typeName })
        setOpenModal(true)
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setDeleteLoading(true)
        try {
            await carTypeApi.delete(deleteId)
            setDeleteId(null)
            fetchData()
        } catch (e) {
            console.error("Delete failed:", e)
        } finally {
            setDeleteLoading(false)
        }
    }

    const onSubmit = async (data: FormValues) => {
        try {
            if (editing) {
                await carTypeApi.update(editing.carTypeId, { typeName: data.typeName })
            } else {
                await carTypeApi.create({ typeName: data.typeName })
            }
            setOpenModal(false)
            fetchData()
        } catch (e) {
            console.error("Save failed:", e)
        }
    }

    if (loading) return <div className="flex items-center justify-center h-64">Đang tải...</div>

    const pgBtn =
        "h-8 min-w-[32px] px-2 border rounded text-sm " +
        "border-gray-300 text-gray-700 hover:bg-gray-100 " +
        "disabled:opacity-40 disabled:cursor-not-allowed"

    const pgBtnActive =
        "h-8 min-w-[32px] px-2 border rounded text-sm " +
        "border-blue-500 bg-blue-500 text-white"

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">🚗 Quản lý loại xe</h1>
                    <p className="text-muted-foreground">Danh sách và thao tác với các loại xe trong hệ thống.</p>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" /> Thêm loại xe
                </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-xl shadow bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="px-4 py-3">STT</th>
                            <th className="px-4 py-3">Tên loại xe</th>
                            <th className="px-4 py-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carTypes.map((ct, i) => (
                            <tr key={ct.carTypeId} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{(page - 1) * pageSize + i + 1}</td>
                                <td className="px-4 py-2 font-medium">{ct.typeName}</td>
                                <td className="px-4 py-2">
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            onClick={() => handleEdit(ct)}
                                            title="Sửa"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => setDeleteId(ct.carTypeId)}
                                            title="Xóa"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2">
                        {/* Trang x/y */}
                        <span className="text-sm text-muted-foreground mr-2">
                            Trang <b>{page}</b>/<b>{totalPages}</b>
                        </span>

                        {/* Về đầu */}
                        <Button
                            className={pgBtn}
                            variant="ghost"
                            size="icon"
                            disabled={page <= 1}
                            onClick={() => setPage(1)}
                        >
                            «
                        </Button>

                        {/* Lùi 1 */}
                        <Button
                            className={pgBtn}
                            variant="ghost"
                            size="icon"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            ‹
                        </Button>

                        {/* Các nút số trang */}
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <Button
                                key={i}
                                className={i + 1 === page ? pgBtnActive : pgBtn}
                                variant="ghost"
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </Button>
                        ))}

                        {/* Tiến 1 */}
                        <Button
                            className={pgBtn}
                            variant="ghost"
                            size="icon"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            ›
                        </Button>

                        {/* Về cuối */}
                        <Button
                            className={pgBtn}
                            variant="ghost"
                            size="icon"
                            disabled={page >= totalPages}
                            onClick={() => setPage(totalPages)}
                        >
                            »
                        </Button>
                    </div>
                </div>
            )}

            {/* Modal thêm/sửa */}
            <ModalForm
                open={openModal}
                onOpenChange={setOpenModal}
                title={editing ? "Sửa loại xe" : "Thêm loại xe"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label className="mb-1 block">Tên loại xe *</Label>
                        <Input {...register("typeName")} placeholder="VD: SUV" />
                        {errors.typeName && (
                            <p className="text-red-500 text-sm mt-1">{errors.typeName.message}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" type="button" onClick={() => setOpenModal(false)}>
                            Hủy
                        </Button>
                        <Button type="submit">{editing ? "Cập nhật" : "Thêm mới"}</Button>
                    </div>
                </form>
            </ModalForm>

            {/* AlertDialog xác nhận xóa */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa loại xe <b>ID {deleteId}</b>? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={deleteLoading}>
                            {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
