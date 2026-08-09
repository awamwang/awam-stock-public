import { io as client, Socket } from 'socket.io-client'

import { SOCKET_EVENTS, ISocketData, SocketDataType } from '@awamstock/shared'
import { server } from '@awamstock/shared/config'
export { SOCKET_EVENTS, ISocketData, SocketDataType }

const SOCKET_PORT = server.port
const CONNECT_WAIT_MS = 10000

export type MySocket = Socket
let io: Promise<MySocket | null> | null = null

/** 解析 socket.io connect_error，提取更具体的原因文案 */
function 解析连接错误(err: Error): { 原因: string; 疑似服务未启动: boolean } {
  const 细节: string[] = [err.message]
  const anyErr = err as Error & { description?: unknown; context?: unknown; cause?: unknown }

  for (const 字段 of [anyErr.description, anyErr.cause, anyErr.context]) {
    if (字段 == null) continue
    if (字段 instanceof Error) {
      细节.push(字段.message)
      if ('code' in 字段 && 字段.code) 细节.push(String(字段.code))
    } else if (typeof 字段 === 'object' && 字段 !== null) {
      const obj = 字段 as Record<string, unknown>
      if (obj.message) 细节.push(String(obj.message))
      if (obj.code) 细节.push(String(obj.code))
      if (obj.status) 细节.push(String(obj.status))
      if (obj.type) 细节.push(String(obj.type))
    } else {
      细节.push(String(字段))
    }
  }

  const 合并 = 细节.filter(Boolean).join(' | ')
  const 疑似服务未启动 =
    /ECONNREFUSED|ENOTFOUND|EHOSTUNREACH|ETIMEDOUT|xhr poll error|websocket error|transport error/i.test(合并)

  return { 原因: 合并, 疑似服务未启动 }
}

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
      let 已提示启动服务端 = false
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
        已提示启动服务端 = false
        console.log('[websocket client] connected to', socketUrl)
        settle(socket)
      })

      socket.on('disconnect', () => {
        console.log('[websocket client] socket disconnected')
      })

      socket.on('connect_error', (err) => {
        // 保持重连，超时后由 settle 放行调度，避免 server 未启动时卡住拉数
        const { 原因, 疑似服务未启动 } = 解析连接错误(err)
        console.warn('[websocket client] connect error:', 原因)
        if (疑似服务未启动 && !已提示启动服务端) {
          已提示启动服务端 = true
          console.warn(`[websocket client] 无法连接 ${socketUrl}，请先启动服务端: pnpm -F=server run dev`)
        }
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
