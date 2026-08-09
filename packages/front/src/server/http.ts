import { Server } from 'socket.io'
import Koa from 'koa'
import Router from 'koa-router'

import { FRONT_SERVER_HTTP_PORT } from '@awamstock/shared/config'
import { useSetCodeHttpHandler } from './handlers/set-code'
import { useApiProxyHttpHandler } from './handlers/proxy'

export default function startHttpServer(io: Server) {
  const app = new Koa()
  const router = new Router()

  useSetCodeHttpHandler(router, io)
  useApiProxyHttpHandler(router)

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(FRONT_SERVER_HTTP_PORT)
  server.on('error', (err: NodeJS.ErrnoException) => {
    console.error('[background] http server error:', err.message)
    if (err.code === 'EADDRINUSE') {
      process.exit(1)
    }
  })
  server.on('listening', () => {
    console.log('[background] http server listening on port', FRONT_SERVER_HTTP_PORT)
  })
}
