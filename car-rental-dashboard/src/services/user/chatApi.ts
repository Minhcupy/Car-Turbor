import { authFetch } from "./http"

export type ChatMessage = {
    id?: string
    conversationId?: string
    senderId: number
    receiverId: number
    content: string
    timestamp: string // Instant serialize dạng ISO string
}

// ✅ load history với admin cố định (BE: /api/messages/me)
export function getConversation() {
    return authFetch<ChatMessage[]>(`/messages/me`)
}

// ✅ gửi tin chỉ cần content
export function sendMessageRest(payload: { content: string }) {
    return authFetch<ChatMessage>(`/messages`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
}
