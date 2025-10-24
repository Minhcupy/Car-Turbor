"use client"

import { Sidebar } from "../Sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { User, Shield } from "lucide-react"

interface Message {
    id: number
    sender: "user" | "admin"
    content: string
    time: string
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: "admin", content: "Xin chào! Tôi có thể giúp gì cho bạn?", time: "10:00" },
        { id: 2, sender: "user", content: "Tôi muốn hỏi về đơn hàng thuê xe của mình.", time: "10:02" },
    ])

    const [newMessage, setNewMessage] = useState("")

    const handleSend = () => {
        if (!newMessage.trim()) return
        const msg: Message = {
            id: messages.length + 1,
            sender: "user",
            content: newMessage,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages([...messages, msg])
        setNewMessage("")
    }

    return (
        <div className="bg-gray-100 px-6 py-8 min-h-screen">
            <div className="mx-auto flex w-full max-w-[1200px] gap-8 items-start">

                {/* Sidebar */}
                <aside className="w-64">
                    <Sidebar />
                </aside>

                {/* Nội dung chính */}
                <section className="flex-1">
                    <Card className="rounded-xl shadow-md h-[650px] flex flex-col">
                        <CardContent className="p-6 flex flex-col h-full">

                            {/* Header + trạng thái */}
                            <div className="mb-4">
                                <h1 className="text-2xl font-bold text-slate-900">Tin nhắn với Admin</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    <span className="text-sm text-gray-600">Admin: Online</span>
                                </div>
                            </div>
                            <hr className="border-t border-gray-200 mb-4" />

                            {/* Khung chat */}
                            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-md border">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        {/* Avatar */}
                                        {msg.sender === "admin" && (
                                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                <Shield className="h-4 w-4 text-gray-700" />
                                            </div>
                                        )}

                                        <div
                                            className={`px-4 py-2 rounded-lg max-w-[70%] text-sm shadow-sm ${msg.sender === "user"
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-800"
                                                }`}
                                        >
                                            <p>{msg.content}</p>
                                            <span className="block text-xs opacity-70 mt-1">{msg.time}</span>
                                        </div>

                                        {msg.sender === "user" && (
                                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                <User className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Input nhắn tin */}
                            <div className="mt-4 flex gap-2">
                                <Input
                                    placeholder="Nhập tin nhắn..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    className="flex-1 rounded-full px-4 shadow-sm"
                                />
                                <Button
                                    onClick={handleSend}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full"
                                >
                                    Gửi
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}
