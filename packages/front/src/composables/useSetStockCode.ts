import { Ref } from 'vue'
import { io, Socket } from 'socket.io-client'

import { SOCKET_EVENTS } from '@awamstock/shared/global'
import { useGlobalStore } from '@/stores/global'
import { FRONT_SOCKET_PORT } from '@/utils/env'

export const client: Socket = io(`http://localhost:${FRONT_SOCKET_PORT}`, { autoConnect: true })

export default function (): {
  code: string
  connected: Ref<boolean>
  update: (code: string) => void
} {
  const global = useGlobalStore()
  const connected = ref(false)

  client.on('connect', () => {
    connected.value = true
    console.log('[background] set code socket connected')

    client.on('disconnect', () => {
      connected.value = false
    })

    client.on(SOCKET_EVENTS.serverSetStockCode, (code: string) => {
      global.setStockCode(code)
    })
  })

  function update(code: string) {
    if (code !== global.stockCode) {
      global.setStockCode(code)
      client.emit(SOCKET_EVENTS.clientSetStockCode, code)
    }
  }

  return {
    code: global.stockCode,
    connected,
    update,
  }
}
