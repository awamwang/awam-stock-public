import { io as client, Socket } from 'socket.io-client'

import { SOCKET_EVENTS, ISocketData, SocketDataType } from '@awamstock/shared'
import { server } from '@awamstock/shared/config'
export { SOCKET_EVENTS, ISocketData, SocketDataType }

const SOCKET_PORT = server.port
const CONNECT_WAIT_MS = 10000

export type MySocket = Socket
let io: Promise<MySocket | null> | null = null

async function initSocketClient(): Promise<MySocket | null> {
  return new Promise((resolve) => {
    try {
      const socketUrl = `http://localhost:${SOCKET_PORT}`
      const socket = client(socketUrl, {
        autoConnect: true,
        timeout: CONNECT_WAIT_MS,
        reconnectionDelayMax: 60000,
        // reconnectionAttempts: 10,
      })

      let settled = false
      const settle = (value: MySocket | null) => {
        if (settled) return
        settled = true
        resolve(value)
      }

      const timer = setTimeout(() => {
        console.warn(`[websocket client] 连接超时，继续启动调度: ${socketUrl}`)
        settle(socket)
      }, CONNECT_WAIT_MS)

      socket.on('connect', () => {
        clearTimeout(timer)
        console.log('[websocket client] connected to', socketUrl)
        settle(socket)
      })

      socket.on('disconnect', () => {
        console.log('[websocket client] socket disconnected')
      })

      socket.on('connect_error', (err) => {
        // 保持重连，超时后由 settle 放行调度，避免 server 未启动时卡住拉数
        console.warn('[websocket client] connect error:', err.message)
      })

      // console.log('[websocket client] connecting to', socketUrl)
    } catch (err) {
      console.error('[websocket] client connect error:', err)
      resolve(null)
    }
  })
}

export default async function getSocketClient(): Promise<MySocket | null> {
  if (io) {
    return io
  }

  return (io = initSocketClient())
}

export async function close() {
  const socket = await getSocketClient()
  socket && socket.close()
  io = null
}
