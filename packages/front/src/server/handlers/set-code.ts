import { Socket, Server } from 'socket.io'
import { Context } from 'koa'
import Router from 'koa-router'

import { SOCKET_EVENTS } from '@awamstock/shared/config'

export function handleSetCodeEvent(client: Socket, io: Server) {
  client.on(SOCKET_EVENTS.clientSetStockCode, (data) => {
    // console.log(SOCKET_EVENTS.clientSetStockCode, data)
    io.emit(SOCKET_EVENTS.serverSetStockCode, data)
  })
}

export function useSetCodeHttpHandler(router: Router, io: Server) {
  router.get('/set-code/:id', (ctx: Context, next) => {
    const { id } = ctx.params
    // console.log('set-code', id)
    io.emit(SOCKET_EVENTS.serverSetStockCode, id)
    ctx.body = id
    next()
  })
}

export default {
  handleSetCodeEvent,
  useSetCodeHttpHandler,
}
