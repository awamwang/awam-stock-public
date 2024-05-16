import { io as client, Socket } from 'socket.io-client'

import { SOCKET_EVENTS, ISocketData, SocketDataType } from '@awamstock/shared'
export { SOCKET_EVENTS, ISocketData, SocketDataType }

const SOCKET_PORT = process.env.AWST_SERVER_PROT || 7002

export type MySocket = Socket
let io: Promise<MySocket> | null = null

async function initSocketClient(): Promise<MySocket> {
  return new Promise((resolve, reject) => {
    try {
      const socketUrl = `http://localhost:${SOCKET_PORT}`
      const io = client(socketUrl, {
        autoConnect: true,
        timeout: 10000,
        reconnectionDelayMax: 60000,
        // reconnectionAttempts: 10,
      })

      io.on('connect', () => {
        console.log('[websocket client] connected to', socketUrl)
        resolve(io)
      })

      io.on('disconnect', () => {
        console.log('[websocket client] socket disconnected')
      })

      io.on('connect_error', (err) => {
        // console.error('[websocket client] connect error:', err)
        // reject(err)
      })

      // console.log('[websocket client] connecting to', socketUrl)
    } catch (err) {
      console.error('[websocket] client connect error:', err)
      reject(err)
    }
  })
}

export default async function getSocketClient(): Promise<MySocket> {
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
