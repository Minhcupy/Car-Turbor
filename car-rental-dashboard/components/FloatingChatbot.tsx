"use client"

import { useEffect, useState } from "react"
import { MessageSquare, X, User, Bot } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CarInfo {
    brand: string
    name: string
    type: string
    seatCount: number
    imageUrl?: string
}

interface Message {
    id: number
    sender: "user" | "bot"
    content: string
    cars?: CarInfo[]
    quickReplies?: string[] // 🟢 thêm field quick replies
}

export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(false)

    // quick replies mẫu
    const defaultReplies = [
        "Xe 7 chỗ có không?",
        "Bảng giá thuê xe",
        "Xe nổi bật hiện tại",
        "Liên hệ hotline"
    ]

    // Lời chào khi mở chat lần đầu
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: Date.now(),
                    sender: "bot",
                    content:
                        "Xin chào 👋, tôi là trợ lý Carbook. Tôi có thể giúp bạn tư vấn thuê xe hoặc giải đáp thắc mắc.",
                    quickReplies: defaultReplies // 🟢 bot gửi kèm quick replies
                },
            ])
        }
    }, [isOpen])

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim()) return
        setMessages(prev => [...prev, { id: Date.now(), sender: "user", content: messageText }])
        setNewMessage("")
        setLoading(true)

        try {
            const res = await fetch("http://localhost:8080/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageText })
            })
            const data = await res.json()
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, sender: "bot", content: data.answer, cars: data.cars }
            ])
        } catch {
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 2, sender: "bot", content: "❌ Xin lỗi, có lỗi xảy ra." }
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="w-96 h-[520px] bg-gradient-to-b from-white to-sky-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-sky-100">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-sky-600 to-blue-500 text-white px-4 py-3 shadow-md">
                        <span className="font-semibold flex items-center gap-2 text-base">
                            <Bot className="h-5 w-5" /> Trợ lý Carbook
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 rounded-full p-1 transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white text-sm">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col gap-2 ${msg.sender === "user" ? "items-end" : "items-start"
                                    }`}
                            >
                                {/* Avatar bot */}
                                {msg.sender === "bot" && (
                                    <div className="flex items-center gap-2">
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-200 flex items-center justify-center shadow">
                                            <Bot className="h-4 w-4 text-gray-700" />
                                        </div>
                                        <div
                                            className="px-4 py-2 rounded-2xl max-w-[70%] shadow-md bg-gradient-to-r from-gray-100 to-white text-gray-900 border"
                                        >
                                            <p className="leading-relaxed">{msg.content}</p>

                                            {/* hiển thị quick replies */}
                                            {msg.quickReplies && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {msg.quickReplies.map((reply, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => sendMessage(reply)}
                                                            className="px-3 py-1 rounded-full border text-xs bg-white hover:bg-sky-50 hover:border-sky-400 transition text-gray-700 shadow-sm"
                                                        >
                                                            {reply}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* hiển thị xe nếu có */}
                                            {msg.cars && msg.cars.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {msg.cars.map((car, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-sm border hover:shadow-md transition"
                                                        >
                                                            {car.imageUrl && (
                                                                <img
                                                                    src={`http://localhost:8080${car.imageUrl}`}
                                                                    alt={car.name}
                                                                    className="w-16 h-12 object-cover rounded-lg"
                                                                />
                                                            )}
                                                            <div>
                                                                <p className="font-semibold text-sm text-gray-800">
                                                                    {car.brand} {car.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {car.seatCount} chỗ - {car.type}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Bubble user */}
                                {msg.sender === "user" && (
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="px-4 py-2 rounded-2xl max-w-[70%] shadow-md bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                                        >
                                            <p>{msg.content}</p>
                                        </div>
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow">
                                            <User className="h-4 w-4 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex items-center gap-2">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-200 flex items-center justify-center shadow">
                                    <Bot className="h-4 w-4 text-gray-700" />
                                </div>
                                <div className="bg-gray-200 px-3 py-2 rounded-2xl shadow flex items-center gap-1">
                                    <span className="animate-bounce">●</span>
                                    <span className="animate-bounce delay-150">●</span>
                                    <span className="animate-bounce delay-300">●</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t flex gap-2 bg-white shadow-inner">
                        <Input
                            placeholder="Nhập tin nhắn..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage(newMessage)}
                            className="flex-1 rounded-full border-gray-300 focus:border-sky-500 focus:ring focus:ring-sky-200 text-sm"
                        />
                        <Button
                            onClick={() => sendMessage(newMessage)}
                            className="bg-gradient-to-r from-sky-600 to-blue-600 hover:opacity-90 text-white rounded-full px-5 shadow"
                        >
                            Gửi
                        </Button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-sky-600 to-blue-500 hover:opacity-90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
                >
                    <MessageSquare className="h-7 w-7" />
                </button>
            )}
        </div>
    )
}
