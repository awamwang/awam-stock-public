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

  app.listen(FRONT_SERVER_HTTP_PORT)
  console.log('[background] http server listening on port', FRONT_SERVER_HTTP_PORT)
}
