"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import { MessageCircle, Send, Wifi, WifiOff, Search } from "lucide-react"

import { Button } from "@/components/ui-admin/button"
import { Textarea } from "@/components/ui-admin/textarea"
import { Badge } from "@/components/ui-admin/badge"
import { Input } from "@/components/ui-admin/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-admin/avatar"

import { getAccessToken } from "@/src/services/user/token"
import { adminSendMessage, getAdminInbox, getChatHistory, type ChatMessage } from "@/src/services/adminChatApi"

// ✅ API mới: GET /users/{id} (admin quyền)
import { getUserById, type UserBrief } from "@/src/services/user/user"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws-chat"
const ADMIN_ID = Number(process.env.NEXT_PUBLIC_SHOP_ID || 1)

function fmtTime(iso?: string) {
  if (!iso) return ""
  const d = new Date(iso)
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  })
}

function buildConversationId(a: number, b: number) {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  return `${min}-${max}`
}

function getOtherUserId(conversationId: string, adminId: number) {
  const [a, b] = conversationId.split("-").map(Number)
  return a === adminId ? b : a
}

type InboxItem = {
  conversationId: string
  userId: number
  lastMessage: ChatMessage
  unread: number
}

export default function ContactsPage() {
  const [connected, setConnected] = useState(false)
  const [loadingInbox, setLoadingInbox] = useState(true)
  const [loadingChat, setLoadingChat] = useState(false)
  const [err, setErr] = useState("")

  const [q, setQ] = useState("")
  const [inbox, setInbox] = useState<InboxItem[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState("")

  const [userMap, setUserMap] = useState<Record<number, UserBrief>>({})

  const clientRef = useRef<Client | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  // ✅ giữ ref để WS callback đọc được activeConversationId mới nhất (vì WS connect 1 lần)
  const activeConversationIdRef = useRef<string | null>(null)
  useEffect(() => {
    activeConversationIdRef.current = activeConversationId
  }, [activeConversationId])

  const activeUserId = useMemo(() => {
    if (!activeConversationId) return null
    return getOtherUserId(activeConversationId, ADMIN_ID)
  }, [activeConversationId])

  const activeUser = useMemo(() => {
    if (!activeUserId) return null
    return userMap[activeUserId] || null
  }, [activeUserId, userMap])

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const el = listRef.current
      if (!el) return
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    })
  }

  // ===== Helpers =====
  const ensureUserLoaded = async (userId: number) => {
    if (!userId) return
    if (userMap[userId]) return
    try {
      const u = await getUserById(userId)
      setUserMap((prev) => ({ ...prev, [userId]: u }))
    } catch (e) {
      // fail thì fallback "User #id"
      console.error("getUserById failed:", userId, e)
    }
  }

  const dedupeAppendMessage = (cid: string, msg: ChatMessage) => {
    setMessages((prev) => {
      // nếu backend có id
      const msgAny: any = msg as any
      const existedById =
          msgAny?.id != null && prev.some((m: any) => m?.id != null && (m as any).id === msgAny.id)

      if (existedById) return prev

      // fallback: cùng senderId + timestamp + content
      const existedFallback = prev.some(
          (m) =>
              m.senderId === msg.senderId &&
              m.timestamp === msg.timestamp &&
              m.content === msg.content
      )

      if (existedFallback) return prev
      return [...prev, { ...msg, conversationId: cid }]
    })
  }

  // 1) Load inbox (REST)
  useEffect(() => {
    ;(async () => {
      try {
        setLoadingInbox(true)
        setErr("")
        const data = await getAdminInbox()

        const items: InboxItem[] =
            (data || [])
                .map((m) => {
                  const cid = m.conversationId || buildConversationId(m.senderId, m.receiverId)
                  const uid = getOtherUserId(cid, ADMIN_ID)
                  return {
                    conversationId: cid,
                    userId: uid,
                    lastMessage: { ...m, conversationId: cid },
                    unread: 0,
                  }
                })
                .sort(
                    (a, b) =>
                        new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
                ) || []

        setInbox(items)

        // preload user info
        const ids = Array.from(new Set(items.map((x) => x.userId))).filter(Boolean)
        ids.forEach((uid) => {
          void ensureUserLoaded(uid)
        })
      } catch (e: any) {
        setErr(e?.message || "Không tải được inbox")
      } finally {
        setLoadingInbox(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2) Connect WS (CHỈ 1 LẦN) + subscribe /topic/admin/inbox
  useEffect(() => {
    if (clientRef.current) return

    const token = getAccessToken()

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
    })

    client.onConnect = () => {
      setConnected(true)

      client.subscribe("/topic/admin/inbox", (frame) => {
        try {
          const msg: ChatMessage = JSON.parse(frame.body)
          const cid = msg.conversationId || buildConversationId(msg.senderId, msg.receiverId)
          const fixed = { ...msg, conversationId: cid }
          const uid = getOtherUserId(cid, ADMIN_ID)

          // fetch user info nếu chưa có
          void ensureUserLoaded(uid)

          // update inbox + unread
          setInbox((prev) => {
            const idx = prev.findIndex((x) => x.conversationId === cid)
            const isActive = activeConversationIdRef.current === cid
            const unreadInc = isActive ? 0 : 1

            if (idx === -1) {
              return [
                {
                  conversationId: cid,
                  userId: uid,
                  lastMessage: fixed,
                  unread: unreadInc,
                },
                ...prev,
              ]
            }

            const next = [...prev]
            const cur = next[idx]
            const updated: InboxItem = {
              ...cur,
              lastMessage: fixed,
              unread: cur.unread + unreadInc,
            }
            next.splice(idx, 1)
            next.unshift(updated)
            return next
          })

          // nếu đang mở đúng conversation -> append vào messages (dedupe)
          if (activeConversationIdRef.current === cid) {
            dedupeAppendMessage(cid, fixed)
            scrollToBottom()
          }
        } catch (e) {
          console.error("WS inbox parse error", e)
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 3) Open conversation: load history (REST)
  const openConversation = async (cid: string) => {
    setActiveConversationId(cid)
    setErr("")

    // reset unread
    setInbox((prev) => prev.map((x) => (x.conversationId === cid ? { ...x, unread: 0 } : x)))

    // preload user info
    const uid = getOtherUserId(cid, ADMIN_ID)
    void ensureUserLoaded(uid)

    try {
      setLoadingChat(true)
      const data = await getChatHistory(cid)
      setMessages(data || [])
      scrollToBottom()
    } catch (e: any) {
      setErr(e?.message || "Không tải được lịch sử chat")
      setMessages([])
    } finally {
      setLoadingChat(false)
    }
  }

  // 4) Admin gửi
  const onSend = async () => {
    const value = text.trim()
    if (!value || !activeUserId || !activeConversationId) return

    setText("")
    setErr("")

    try {
      const saved = await adminSendMessage({ receiverId: activeUserId, content: value })

      // Nếu WS đang mất kết nối thì append thủ công (dedupe)
      if (!connected) {
        dedupeAppendMessage(activeConversationId, saved)
        scrollToBottom()
      }
    } catch (e: any) {
      setErr(e?.message || "Gửi tin nhắn thất bại")
    }
  }

  const filteredInbox = useMemo(() => {
    const kw = q.trim().toLowerCase()
    if (!kw) return inbox

    return inbox.filter((x) => {
      const u = userMap[x.userId]
      const name = (u?.userName || `User #${x.userId}`).toLowerCase()
      const s = `${x.userId} ${name} ${x.lastMessage.content}`.toLowerCase()
      return s.includes(kw)
    })
  }, [inbox, q, userMap])

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance flex items-center gap-2">
              <MessageCircle className="h-7 w-7" />
              Inbox chat
            </h1>
            <p className="text-muted-foreground">Nhận tin nhắn realtime từ khách và phản hồi ngay.</p>
          </div>

          <div
              className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                connected ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
              ].join(" ")}
          >
            {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {connected ? "Đang kết nối" : "Mất kết nối"}
          </div>
        </div>

        {err ? <div className="text-sm text-rose-600">{err}</div> : null}

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Inbox list */}
          <div className="lg:col-span-4 rounded-xl border bg-white overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className="pl-9"
                      placeholder="Tìm theo userId / tên / nội dung..."
                  />
                </div>
                <Badge variant="secondary">{filteredInbox.length}</Badge>
              </div>
            </div>

            <div className="max-h-[640px] overflow-y-auto divide-y">
              {loadingInbox ? (
                  <div className="p-4 text-sm text-muted-foreground">Đang tải inbox...</div>
              ) : filteredInbox.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">Chưa có tin nhắn.</div>
              ) : (
                  filteredInbox.map((item) => {
                    const active = item.conversationId === activeConversationId
                    const u = userMap[item.userId]
                    const displayName = u?.userName || `User #${item.userId}`

                    return (
                        <button
                            key={item.conversationId}
                            onClick={() => openConversation(item.conversationId)}
                            className={[
                              "w-full text-left p-4 hover:bg-muted/50 transition",
                              active ? "bg-muted/50" : "",
                            ].join(" ")}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="h-9 w-9">
                                <AvatarImage
                                    src={u?.avatarUrl || "/default-avatar.png"}
                                    alt={displayName}
                                />
                                <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>

                              <div className="min-w-0">
                                <div className="font-semibold truncate">{displayName}</div>
                                <div className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                  {item.lastMessage.content}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.unread > 0 ? <Badge>{item.unread} new</Badge> : null}
                              <span className="text-xs text-muted-foreground">
                          {fmtTime(item.lastMessage.timestamp)}
                        </span>
                            </div>
                          </div>
                        </button>
                    )
                  })
              )}
            </div>
          </div>

          {/* Chat view */}
          <div className="lg:col-span-8 rounded-xl border bg-white overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold min-w-0">
                  {activeConversationId && activeUserId ? (
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                              src={activeUser?.avatarUrl || "/default-avatar.png"}
                              alt={activeUser?.userName || `User #${activeUserId}`}
                          />
                          <AvatarFallback>
                            {(activeUser?.userName || `U`).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">
                      {activeUser?.userName || `User #${activeUserId}`}
                    </span>
                      </div>
                  ) : (
                      "Chọn 1 cuộc hội thoại"
                  )}
                </div>

                <div className="text-xs text-muted-foreground">{activeConversationId ?? ""}</div>
              </div>
            </div>

            <div ref={listRef} className="h-[520px] bg-muted/20 overflow-y-auto p-4 space-y-3">
              {!activeConversationId ? (
                  <div className="text-sm text-muted-foreground p-2">
                    Chọn một cuộc hội thoại ở cột trái để xem nội dung.
                  </div>
              ) : loadingChat ? (
                  <div className="text-sm text-muted-foreground p-2">Đang tải lịch sử...</div>
              ) : messages.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-2">Chưa có tin nhắn.</div>
              ) : (
                  messages.map((m) => {
                    const isAdmin = m.senderId === ADMIN_ID
                    const key =
                        (m as any)?.id != null
                            ? String((m as any).id)
                            : `${m.senderId}-${m.receiverId}-${m.timestamp}-${m.content}`

                    return (
                        <div key={key} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                          <div
                              className={[
                                "max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                isAdmin ? "bg-primary text-primary-foreground" : "bg-background border",
                              ].join(" ")}
                          >
                            <div className="whitespace-pre-wrap">{m.content}</div>
                            <div
                                className={`mt-1 text-[11px] ${
                                    isAdmin ? "text-primary-foreground/70" : "text-muted-foreground"
                                }`}
                            >
                              {fmtTime(m.timestamp)}
                            </div>
                          </div>
                        </div>
                    )
                  })
              )}
            </div>

            <div className="border-t p-4 bg-white">
              <div className="flex items-end gap-3">
                <Textarea
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={activeConversationId ? "Nhập phản hồi..." : "Chọn cuộc hội thoại để trả lời"}
                    disabled={!activeConversationId}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        if (text.trim()) onSend()
                      }
                    }}
                />
                <Button onClick={onSend} disabled={!activeConversationId || !text.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Gửi
                </Button>
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                WS: <code>/topic/admin/inbox</code>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
