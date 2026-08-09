import { Ref } from 'vue'
import { io, Socket } from 'socket.io-client'

import { SOCKET_EVENTS } from '@awamstock/shared/global'
import { useGlobalStore } from '@/stores/global'
import { FRONT_SOCKET_PORT } from '@/utils/env'

export const client: Socket = io(`http://localhost:${FRONT_SOCKET_PORT}`, { autoConnect: true })

const connected = ref(false)
let listenersBound = false

function bindSocketListeners() {
  if (listenersBound) return
  listenersBound = true

  const syncConnected = () => {
    connected.value = client.connected
  }

  client.on('connect', () => {
    syncConnected()
    console.log('[background] set code socket connected')
  })
  client.on('disconnect', syncConnected)
  client.on(SOCKET_EVENTS.serverSetStockCode, (code: string) => {
    useGlobalStore().setStockCode(code)
  })
  syncConnected()
}

export default function (): {
  code: string
  connected: Ref<boolean>
  update: (code: string) => void
} {
  const global = useGlobalStore()
  bindSocketListeners()

  function update(code: string) {
    const next = String(code || '').trim()
    if (!next || next === global.stockCode) return
    global.setStockCode(next)
    client.emit(SOCKET_EVENTS.clientSetStockCode, next)
  }

  return {
    code: global.stockCode,
    connected,
    update,
  }
}
