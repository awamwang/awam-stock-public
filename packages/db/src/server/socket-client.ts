import { io as client, Socket } from 'socket.io-client'

import { SOCKET_EVENTS, ISocketData, SocketDataType } from '@awamstock/shared'
import { server } from '@awamstock/shared/config'
export { SOCKET_EVENTS, ISocketData, SocketDataType }

const SOCKET_PORT = server.port
const CONNECT_WAIT_MS = 10000
/** 连续失败达到该次数后才开始打印连接错误 */
const 错误日志起始次数 = 3
/** 首次打印后的退避基数（毫秒），之后按指数增长 */
const 错误日志基础间隔Ms = 2000
const 错误日志最大间隔Ms = 60000
/** 连接保持超过该时间才视为稳定，断连时才打印 */
const 稳定连接阈值Ms = 5000

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
      let 连续失败次数 = 0
      let 下次错误日志时间 = 0
      let 已提示启动服务端 = false
      let 连接建立时间 = 0
      const settle = (value: MySocket | null) => {
        if (settled) return
        settled = true
        resolve(value)
      }

      const 重置错误日志状态 = () => {
        连续失败次数 = 0
        下次错误日志时间 = 0
      }

      /** 指数退避：前几次静默，之后按 2s、4s、8s… 节流打印 */
      const 应打印错误日志 = (): boolean => {
        连续失败次数++
        if (连续失败次数 < 错误日志起始次数) return false

        const now = Date.now()
        if (now < 下次错误日志时间) return false

        const 退避档位 = 连续失败次数 - 错误日志起始次数
        const 间隔 = Math.min(错误日志基础间隔Ms * 2 ** 退避档位, 错误日志最大间隔Ms)
        下次错误日志时间 = now + 间隔
        return true
      }

      const timer = setTimeout(() => {
        console.warn(`[websocket client] 连接超时，继续启动调度: ${socketUrl}`)
        settle(socket)
      }, CONNECT_WAIT_MS)

      socket.on('connect', () => {
        clearTimeout(timer)
        重置错误日志状态()
        已提示启动服务端 = false
        连接建立时间 = Date.now()
        console.log('[websocket client] connected to', socketUrl)
        settle(socket)
      })

      socket.on('disconnect', () => {
        // 短暂连上又断开属于抖动，不立即打印
        if (连接建立时间 && Date.now() - 连接建立时间 >= 稳定连接阈值Ms) {
          console.log('[websocket client] socket disconnected')
        }
        连接建立时间 = 0
      })

      socket.on('connect_error', (err) => {
        // 保持重连，超时后由 settle 放行调度，避免 server 未启动时卡住拉数
        if (!应打印错误日志()) return

        const { 原因, 疑似服务未启动 } = 解析连接错误(err)
        console.warn(`[websocket client] connect error (已重试 ${连续失败次数} 次):`, 原因)
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
