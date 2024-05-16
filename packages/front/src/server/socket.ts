import { Server } from 'socket.io'

import { FRONT_SERVER_SOCKET_PORT } from '@awamstock/shared/config'
import { handleSetCodeEvent } from './handlers/set-code'
import { handleStocksoftLinkEvent } from './handlers/stocksoft-link'

export default function startSocketServer(): Server {
  const io = new Server({
    cors: {
      // origin: 'http://localhost:8080',
      origin: '*',
      methods: ['GET', 'POST'],
      // allowedHeaders: ['my-custom-header'],
      // credentials: true,
    },
  })

  io.on('connection', (client) => {
    console.log('socket connected:', client.id)

    handleSetCodeEvent(client, io)
    handleStocksoftLinkEvent(client)

    client.on('disconnect', () => {
      console.log('socket disconnect: ', client.id)
    })
  })

  console.log('[background] socket server listening on port', FRONT_SERVER_SOCKET_PORT)
  return io.listen(FRONT_SERVER_SOCKET_PORT)
}

if (process.argv && process.argv[1] && process.argv[1].includes('socket.ts')) {
  startSocketServer()
}
