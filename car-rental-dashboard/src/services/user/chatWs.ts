import SockJS from "sockjs-client"
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs"
import { getAccessToken } from "./token"

export type WsChatMessage = {
    senderId: number
    receiverId: number
    content: string
    timestamp: string
}

const WS_URL = (process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws-chat").replace(/\/$/, "")

export function createChatWs(params: {
    topic: string
    onConnected?: (ok: boolean) => void
    onMessage: (msg: WsChatMessage) => void
}) {
    const token = getAccessToken()

    const client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        reconnectDelay: 2000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: () => {}, // tắt log spam
    })

    let sub: StompSubscription | null = null

    client.onConnect = () => {
        params.onConnected?.(true)
        sub = client.subscribe(params.topic, (frame: IMessage) => {
            params.onMessage(JSON.parse(frame.body))
        })
    }

    client.onWebSocketClose = () => params.onConnected?.(false)
    client.onStompError = () => params.onConnected?.(false)

    return {
        connect: () => client.activate(),
        disconnect: async () => {
            sub?.unsubscribe()
            await client.deactivate()
        },
        publish: (destination: string, body: any) => {
            client.publish({ destination, body: JSON.stringify(body) })
        },
    }
}
