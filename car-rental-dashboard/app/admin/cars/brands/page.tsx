"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { brandApi, type BrandDTO, type BrandPage, type BrandUpsert } from "@/src/services/brandApi"

import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { ModalForm } from "@/components/ui-admin/modal-form"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"   // 🔹 Thêm toast

// ✅ Validate schema
const schema = z.object({
    brandName: z.string().min(1, "Tên thương hiệu không được để trống"),
    description: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export default function BrandsPage() {
    const [brandPage, setBrandPage] = useState<BrandPage | null>(null)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(true)

    // Modal
    const [openModal, setOpenModal] = useState(false)
    const [editing, setEditing] = useState<BrandDTO | null>(null)
    const [logoFile, setLogoFile] = useState<File | null>(null)

    // React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { brandName: "", description: "" },
    })

    // Load danh sách brands
    const fetchBrands = async () => {
        try {
            setLoading(true)
            const data = await brandApi.getPage(page, pageSize, keyword)
            setBrandPage(data)
        } catch (e) {
            console.error("Failed to fetch brands:", e)
            toast.error("Không thể tải danh sách thương hiệu")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBrands()
    }, [page, pageSize, keyword])

    // Thêm
    const handleAdd = () => {
        setEditing(null)
        setLogoFile(null)
        reset({ brandName: "", description: "" })
        setOpenModal(true)
    }

    // Sửa
    const handleEdit = (b: BrandDTO) => {
        setEditing(b)
        setLogoFile(null)
        reset({ brandName: b.brandName || "", description: b.description || "" })
        setOpenModal(true)
    }

    // Xoá
    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xoá thương hiệu này?")) return
        try {
            await brandApi.delete(id)
            toast.success("Xoá thương hiệu thành công ✅")
            fetchBrands()
        } catch (e) {
            console.error("Delete failed:", e)
            toast.error("Xoá thương hiệu thất bại ❌")
        }
    }

    // Lưu (Create/Update)
    const onSubmit = async (data: FormValues) => {
        try {
            const payload: BrandUpsert = { ...data, logo: logoFile }
            if (editing) {
                await brandApi.update(editing.brandId, payload)
                toast.success("Cập nhật thương hiệu thành công ✅")
            } else {
                await brandApi.create(payload)
                toast.success("Thêm thương hiệu thành công ✅")
            }
            setOpenModal(false)
            fetchBrands()
        } catch (e) {
            console.error("Save failed:", e)
            toast.error("Lưu thương hiệu thất bại ❌")
        }
    }

    if (loading) return <div className="flex items-center justify-center h-64">Đang tải...</div>

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">🏷 Quản lý thương hiệu</h1>
                    <p className="text-muted-foreground">Danh sách các thương hiệu xe trong hệ thống.</p>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" /> Thêm thương hiệu
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Tìm kiếm thương hiệu..."
                    className="w-64"
                    value={keyword}
                    onChange={(e) => {
                        setPage(1)
                        setKeyword(e.target.value)
                    }}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-xl shadow bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Logo</th>
                            <th className="px-4 py-3 text-left">Tên thương hiệu</th>
                            <th className="px-4 py-3 text-left">Mô tả</th>
                            <th className="px-4 py-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brandPage?.content.map((b) => (
                            <tr key={b.brandId} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">
                                    {b.logoUrl ? (
                                        <Image
                                            src={b.logoUrl.startsWith("http") ? b.logoUrl : `http://localhost:8080${b.logoUrl}`}
                                            alt={b.brandName}
                                            width={70}
                                            height={40}
                                            className="rounded border object-contain bg-white"
                                        />
                                    ) : (
                                        <span className="text-gray-400 italic">Không có logo</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 font-medium">{b.brandName}</td>
                                <td className="px-4 py-2">{b.description || "—"}</td>
                                <td className="px-4 py-2 text-center">
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            onClick={() => handleEdit(b)}
                                            title="Sửa"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => handleDelete(b.brandId)}
                                            title="Xoá"
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
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                    Hiển thị {(page - 1) * pageSize + 1} –{" "}
                    {Math.min(page * pageSize, brandPage?.totalElements || 0)} /{" "}
                    {brandPage?.totalElements || 0} thương hiệu
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        ← Trước
                    </Button>
                    {Array.from({ length: brandPage?.totalPages || 1 }, (_, i) => (
                        <Button
                            key={i}
                            size="sm"
                            variant={page === i + 1 ? "default" : "outline"}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={page >= (brandPage?.totalPages || 1)}
                        onClick={() => setPage(page + 1)}
                    >
                        Sau →
                    </Button>
                </div>
            </div>

            {/* Modal thêm/sửa */}
            <ModalForm
                open={openModal}
                onOpenChange={setOpenModal}
                title={editing ? "Sửa thương hiệu" : "Thêm thương hiệu"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label>Tên thương hiệu *</Label>
                        <Input {...register("brandName")} placeholder="VD: Toyota" />
                        {errors.brandName && (
                            <p className="text-sm text-red-500">{errors.brandName.message}</p>
                        )}
                    </div>

                    <div>
                        <Label>Mô tả</Label>
                        <Input {...register("description")} placeholder="Mô tả ngắn..." />
                    </div>

                    <div>
                        <Label>Logo (tùy chọn)</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                        />
                        {editing?.logoUrl && !logoFile && (
                            <div className="mt-2">
                                <Image
                                    src={
                                        editing.logoUrl.startsWith("http")
                                            ? editing.logoUrl
                                            : `http://localhost:8080${editing.logoUrl}`
                                    }
                                    alt="current logo"
                                    width={100}
                                    height={60}
                                    className="rounded border object-contain bg-white"
                                />
                            </div>
                        )}
                        {logoFile && (
                            <div className="mt-2">
                                <img
                                    src={URL.createObjectURL(logoFile)}
                                    alt="new logo"
                                    className="h-16 w-auto rounded border bg-white object-contain"
                                />
                            </div>
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
        </div>
    )
}
