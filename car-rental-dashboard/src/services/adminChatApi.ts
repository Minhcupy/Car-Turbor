import { authFetch } from "@/src/services/user/http"

export type ChatMessage = {
    id?: string
    conversationId?: string
    senderId: number
    receiverId: number
    content: string
    timestamp: string
}

export function getAdminInbox() {
    return authFetch<ChatMessage[]>(`/admin/messages/inbox`)
}

export function getChatHistory(conversationId: string) {
    return authFetch<ChatMessage[]>(`/chat/history/${conversationId}`)
}

export function adminSendMessage(payload: { receiverId: number; content: string }) {
    return authFetch<ChatMessage>(`/admin/messages/send`, {
        method: "POST",
        body: JSON.stringify(payload),
    })
}
