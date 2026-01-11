"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Client } from "@stomp/stompjs"
import { MessageCircle, Send, Wifi, WifiOff, MapPin, Phone, Clock, ShieldCheck } from "lucide-react"
import SockJS from "sockjs-client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { getConversation, sendMessageRest, type ChatMessage } from "@/src/services/user/chatApi"
import { getAccessToken } from "@/src/services/user/token"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMyAvatar, getAvatarById } from "@/src/services/user/user"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws-chat"
const SHOP_ID = Number(process.env.NEXT_PUBLIC_SHOP_ID || 1)

function fmtTime(iso?: string) {
  if (!iso) return ""
  try {
    const d = new Date(iso)
    return d.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })
  } catch {
    return ""
  }
}

function buildConversationId(a: number, b: number) {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  return `${min}-${max}`
}

export default function ContactPage() {
  const [userId, setUserId] = useState<number | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState("")

  const clientRef = useRef<Client | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const [myAvatar, setMyAvatar] = useState<string | null>(null)
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null)

  const adminId = SHOP_ID

  const conversationId = useMemo(() => {
    if (!userId) return null
    return buildConversationId(userId, adminId)
  }, [userId, adminId])

  const topic = useMemo(() => {
    if (!conversationId) return null
    return `/topic/conversations/${conversationId}`
  }, [conversationId])

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    })
  }

  // lấy userId từ localStorage
  useEffect(() => {
    const idStr = localStorage.getItem("userId")
    setUserId(idStr ? Number(idStr) : null)
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        // user avatar (chính mình)
        const me = await getMyAvatar()
        setMyAvatar(me.avatarUrl ?? null)
      } catch {}

      try {
        // admin avatar
        const ad = await getAvatarById(adminId)
        setAdminAvatar(ad.avatarUrl ?? null)
      } catch (e) {
        // nếu bị 403 => backend chưa cho user đọc /users/{id}
        console.warn("Không lấy được avatar admin:", e)
      }
    })()
  }, [adminId])

  // load history
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      setMessages([])
      return
    }
    ;(async () => {
      try {
        setLoading(true)
        setErr("")
        const data = await getConversation()
        setMessages(data || [])
        scrollToBottom()
      } catch (e: any) {
        setErr(e?.message || "Không tải được lịch sử chat")
      } finally {
        setLoading(false)
      }
    })()
  }, [userId, adminId])

  // connect STOMP (subscribe only)
  useEffect(() => {
    if (!topic || !conversationId || !userId) return

    const accessToken = getAccessToken()

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
    })

    client.onConnect = () => {
      setConnected(true)

      client.subscribe(topic, (frame) => {
        try {
          const msg: ChatMessage = JSON.parse(frame.body)

          // tránh double khi reconnect: nếu BE gửi lại hoặc FE append REST
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (
                last &&
                last.timestamp === msg.timestamp &&
                last.senderId === msg.senderId &&
                last.receiverId === msg.receiverId &&
                last.content === msg.content
            ) {
              return prev
            }
            return [...prev, msg]
          })

          scrollToBottom()
        } catch {}
      })
    }

    client.onWebSocketClose = () => setConnected(false)
    client.onStompError = () => setConnected(false)

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
      clientRef.current = null
    }
  }, [topic, conversationId, userId])

  const onSend = async () => {
    const value = text.trim()
    if (!value || !userId) return

    setErr("")
    setText("")

    try {
      // ✅ gửi REST để BE lưu Mongo + broadcast WS
      const saved = await sendMessageRest({ content: value })

      // Nếu WS đang mất kết nối => không nhận được broadcast => tự append
      if (!connected) {
        setMessages((prev) => [...prev, saved])
        scrollToBottom()
      }
    } catch (e: any) {
      setErr(e?.message || "Gửi tin nhắn thất bại")
    }
  }

  // JSX của bạn giữ nguyên, chỉ đổi logic bên trên
  return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Hỗ trợ trực tuyến</h1>
                <p className="text-sm text-gray-600">
                  Chat realtime với quản trị viên để được giúp đỡ nhanh chóng
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div
                    className={[
                      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                      connected ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
                    ].join(" ")}
                >
                  {connected ? (
                      <>
                        <Wifi className="h-4 w-4" /> Đang kết nối
                      </>
                  ) : (
                      <>
                        <WifiOff className="h-4 w-4" /> Mất kết nối
                      </>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 px-3 py-1 text-sm">
                  <ShieldCheck className="h-4 w-4" />
                  <span>User: {userId ?? "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 sm:py-10">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left panel */}
            <aside className="lg:col-span-4 space-y-6">
              <Card className="border-sky-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <MessageCircle className="h-5 w-5 text-sky-600" />
                    Thông tin liên hệ
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="bg-sky-100 p-2 rounded-xl">
                      <MapPin className="h-5 w-5 text-sky-700" />
                    </div>
                    <div>
                      <p className="font-semibold">Địa chỉ</p>
                      <p className="text-gray-600">
                        Trường Đại học Tài nguyên và Môi trường Hà Nội
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-sky-100 p-2 rounded-xl">
                      <Phone className="h-5 w-5 text-sky-700" />
                    </div>
                    <div>
                      <p className="font-semibold">Hotline</p>
                      <p className="text-gray-600">0123 456 789</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-sky-100 p-2 rounded-xl">
                      <Clock className="h-5 w-5 text-sky-700" />
                    </div>
                    <div>
                      <p className="font-semibold">Giờ hỗ trợ</p>
                      <p className="text-gray-600">06:00 – 22:00 (khẩn cấp 24/7)</p>
                    </div>
                  </div>

                  {/*<div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">*/}
                  {/*  <p className="text-sm font-semibold text-gray-900">Trạng thái phiên</p>*/}
                  {/*  <div className="mt-2 space-y-1 text-sm text-gray-600">*/}
                  {/*    <p>*/}
                  {/*      <span className="text-gray-500">ShopId:</span> {adminId}*/}
                  {/*    </p>*/}
                  {/*    <p className="break-all">*/}
                  {/*      <span className="text-gray-500">Topic:</span> {topic ?? "-"}*/}
                  {/*    </p>*/}
                  {/*    <p>*/}
                  {/*      <span className="text-gray-500">UserId:</span>{" "}*/}
                  {/*      {userId ?? "Chưa đăng nhập / thiếu userId trong localStorage"}*/}
                  {/*    </p>*/}
                  {/*  </div>*/}
                  {/*</div>*/}

                  <div className="flex gap-3">
                    <Link href="/user/services" className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl">
                        Xem dịch vụ
                      </Button>
                    </Link>
                    <Link href="/user/cars" className="flex-1">
                      <Button className="w-full bg-sky-600 hover:bg-sky-700 rounded-xl">
                        Xem xe
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <div className="hidden lg:block text-xs text-gray-500">
                Tip: Nếu mất kết nối, hệ thống sẽ tự reconnect.
              </div>
            </aside>

            {/* Chat panel */}
            <section className="lg:col-span-8">
              <Card className="border-sky-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900">Hộp thoại</CardTitle>
                    <div className="text-xs text-gray-500">
                      {connected ? "Realtime" : "Đang reconnect..."}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    Gửi tin nhắn để được hỗ trợ nhanh
                  </p>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Messages */}
                  <div
                      ref={listRef}
                      className="h-[520px] sm:h-[600px] overflow-y-auto bg-gradient-to-b from-sky-50 to-white px-3 py-4 sm:px-5 space-y-3"
                  >
                    {loading ? (
                        <div className="text-center text-gray-500 text-sm py-14">
                          Đang tải lịch sử chat...
                        </div>
                    ) : err ? (
                        <div className="text-center text-rose-600 text-sm py-10">
                          {err}
                          <button
                              className="underline ml-2"
                              onClick={async () => {
                                if (!userId) return
                                try {
                                  setErr("")
                                  setLoading(true)
                                  const data = await getConversation()
                                  setMessages(data || [])
                                } catch (e: any) {
                                  setErr(e?.message || "Không tải được lịch sử chat")
                                } finally {
                                  setLoading(false)
                                  scrollToBottom()
                                }
                              }}
                          >
                            Thử lại
                          </button>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm py-14">
                          Chưa có tin nhắn. Hãy gửi lời chào 👋
                        </div>
                    ) : (
                        messages.map((m, idx) => {
                          const isMe = m.senderId === userId
                          const key = `${m.timestamp}-${idx}`

                          return (
                              <div key={key} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                {/* Avatar nhỏ */}
                                {!isMe && (
                                    <div className="mr-2 mt-1 hidden sm:block">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={adminAvatar || "/default-avatar.png"} alt="Admin" />
                                        <AvatarFallback>AD</AvatarFallback>
                                      </Avatar>
                                    </div>
                                )}

                                <div className={`max-w-[86%] sm:max-w-[75%]`}>
                                  <div
                                      className={[
                                        "rounded-2xl px-4 py-3 shadow-sm",
                                        isMe
                                            ? "bg-sky-600 text-white rounded-br-md"
                                            : "bg-white text-gray-900 border border-sky-100 rounded-bl-md",
                                      ].join(" ")}
                                  >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                  </div>

                                  <div
                                      className={[
                                        "mt-1 text-[11px] px-1",
                                        isMe ? "text-right text-gray-500" : "text-left text-gray-500",
                                      ].join(" ")}
                                  >
                                    {fmtTime(m.timestamp)}
                                  </div>
                                </div>

                                {isMe && (
                                    <div className="ml-2 mt-1 hidden sm:block">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={myAvatar || "/default-avatar.png"} alt="Me" />
                                        <AvatarFallback>ME</AvatarFallback>
                                      </Avatar>
                                    </div>
                                )}
                              </div>
                          )
                        })
                    )}
                  </div>

                  {/* Composer */}
                  <div className="border-t border-sky-100 bg-white p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <Input
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder={userId ? "Nhập tin nhắn..." : "Vui lòng đăng nhập để chat"}
                          className="border-sky-200 focus:border-sky-500 rounded-xl"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") onSend()
                          }}
                          disabled={!userId}
                      />

                      <Button
                          onClick={onSend}
                          className="bg-sky-600 hover:bg-sky-700 rounded-xl"
                          disabled={!text.trim() || !userId}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Gửi
                      </Button>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>{connected ? "Đã kết nối" : "Đang tự reconnect..."}</span>
                      <span className="hidden sm:inline">Enter để gửi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
  )
}
