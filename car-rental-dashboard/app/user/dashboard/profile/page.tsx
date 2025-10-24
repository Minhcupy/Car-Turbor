"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "../Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    getCurrentProfile,
    deleteProfile,
    updateProfile,
    UserProfile,
} from "@/src/services/user/user"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState<Partial<UserProfile>>({})
    const [errors, setErrors] = useState<{ [k: string]: string }>({})

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getCurrentProfile()
                setProfile(data)
            } catch (err) {
                console.error("Failed to load profile", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleDelete = async () => {
        if (!confirm("Bạn có chắc muốn xoá tài khoản?")) return
        try {
            await deleteProfile()
            alert("Tài khoản đã được xoá thành công")
        } catch (err) {
            console.error("Delete failed", err)
            alert("Xoá tài khoản thất bại")
        }
    }

    const handleEdit = () => {
        if (profile) {
            setForm({
                userFullName: profile.userFullName,
                userPhone: profile.userPhone,
                avatarUrl: profile.avatarUrl,
            })
            setErrors({})
            setOpen(true)
        }
    }

    const handleSave = async () => {
        try {
            await updateProfile(form)
            setProfile({ ...profile!, ...form })
            setOpen(false)
            alert("Cập nhật thông tin thành công")
        } catch (err) {
            console.error("Update failed", err)
            alert("Cập nhật thất bại")
        }
    }

    if (loading) return <div className="p-6">Đang tải thông tin...</div>
    if (!profile) return <div className="p-6 text-red-500">Không tìm thấy thông tin người dùng</div>

    return (
        <div className="bg-gray-100 px-6 pt-8 pb-6 min-h-screen">
            <div className="mx-auto flex w-full max-w-[1200px] gap-8 items-start">
                {/* Sidebar */}
                <aside className="w-64">
                    <Sidebar />
                </aside>

                {/* Nội dung chính */}
                <section className="flex-1">
                    <Card className="rounded-xl shadow-md border border-gray-200">
                        <CardContent className="p-8 space-y-8">
                            <h1 className="text-2xl font-bold text-slate-900">Thông tin tài khoản</h1>

                            {/* Avatar + Buttons */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`http://localhost:8080${profile.avatarUrl || "/uploads/default-avatar.png"}`}
                                        alt="Avatar"
                                        className="h-24 w-24 rounded-full border-2 border-blue-500 object-cover"
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">
                                            {profile.userFullName || profile.userName}
                                        </h2>
                                        <p className="text-sm text-slate-500">{profile.userEmail}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        className="border-green-600 text-green-600 hover:bg-green-50 px-6"
                                        onClick={handleEdit}
                                    >
                                        Chỉnh sửa thông tin
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-50 px-6"
                                        onClick={handleDelete}
                                    >
                                        Xoá tài khoản
                                    </Button>
                                </div>
                            </div>

                            <hr className="border-t border-gray-200" />

                            {/* Form hiển thị */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
                                    <Input
                                        value={profile.userFullName || ""}
                                        disabled
                                        className="bg-blue-50 text-gray-900 text-base font-semibold border-2 border-blue-500 rounded-lg px-4 py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
                                    <Input
                                        value={profile.userPhone || ""}
                                        disabled
                                        className="bg-blue-50 text-gray-900 text-base font-semibold border-2 border-blue-500 rounded-lg px-4 py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                    <Input
                                        value={profile.userEmail}
                                        disabled
                                        className="bg-blue-50 text-gray-900 text-base font-semibold border-2 border-blue-500 rounded-lg px-4 py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Vai trò</label>
                                    <Input
                                        value={profile.roles.join(", ")}
                                        disabled
                                        className="bg-blue-50 text-gray-900 text-base font-semibold border-2 border-blue-500 rounded-lg px-4 py-3 uppercase"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>

            {/* Modal chỉnh sửa */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-slate-800">
                            Chỉnh sửa thông tin
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
                            <Input
                                value={form.userFullName || ""}
                                onChange={(e) => setForm({ ...form, userFullName: e.target.value })}
                                className="border-2 border-blue-500 rounded-lg px-4 py-3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
                            <Input
                                value={form.userPhone || ""}
                                onChange={(e) => setForm({ ...form, userPhone: e.target.value })}
                                className="border-2 border-blue-500 rounded-lg px-4 py-3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Avatar URL</label>
                            <Input
                                value={form.avatarUrl || ""}
                                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                                className="border-2 border-blue-500 rounded-lg px-4 py-3"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSave} className="bg-green-600 text-white">
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
