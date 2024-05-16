import { Server } from 'socket.io'

import { SOCKET_EVENTS, ISocketData, SocketDataType } from '@awamstock/shared'
export { SOCKET_EVENTS, ISocketData, SocketDataType }

const NO_SOCKET_SERVER = true
const SOCKET_PORT = 6001

export type MySocket = Server | null
let io: MySocket = null

export default async function getSocketServer(): Promise<MySocket> {
  if (io || NO_SOCKET_SERVER) {
    return io
  }

  try {
    io = new Server({
      cors: {
        // origin: 'http://localhost:7001',
        origin: '*',
        methods: ['GET', 'POST'],
        // allowedHeaders: ['my-custom-header'],
        credentials: true,
      },
    })

    io.on('connection', (client) => {
      console.log('[websocket server] client connected', client.id)

      client.on('disconnect', () => {
        console.log('[websocket server] client disconnect', client.id)
      })
    })

    io.on('connect_error', (err) => {
      console.error('[websocket server] connect error:', err)
    })

    console.log('[websocket server] listening on port', SOCKET_PORT)
    return io.listen(SOCKET_PORT)
  } catch (err) {
    console.error('[websocket server] start error:', err)
    return null
  }
}

export async function close() {
  if (io) {
    io.close()
    io = null
  }
}
