import { Socket, Server } from 'socket.io'

import { SOCKET_EVENTS } from '@awamstock/shared/config'

const DEFAULT_URL = 'ws://127.0.0.1:8765'
const RECONNECT_MS = 3000

type ThsLinkerSyncPayload = {
  enabled: boolean
  url?: string
}

class ThsLinkerBridge {
  private ws: WebSocket | null = null
  private url = DEFAULT_URL
  private shouldConnect = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private io: Server | null = null
  private lastCode = ''

  start(io: Server, url?: string) {
    this.io = io
    if (url?.trim()) {
      this.url = url.trim()
    }
    this.shouldConnect = true
    this.clearReconnectTimer()
    this.open()
  }

  stop() {
    this.shouldConnect = false
    this.clearReconnectTimer()
    if (this.ws) {
      this.ws.onopen = null
      this.ws.onclose = null
      this.ws.onerror = null
      this.ws.onmessage = null
      try {
        this.ws.close()
      } catch {
        // ignore
      }
      this.ws = null
    }
    this.lastCode = ''
    console.log('[ths-linker-bridge] stopped')
  }

  private open() {
    if (!this.shouldConnect) return
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    try {
      const ws = new WebSocket(this.url)
      this.ws = ws

      ws.onopen = () => {
        console.log('[ths-linker-bridge] connected', this.url)
        ws.send(JSON.stringify({ type: 'list' }))
      }

      ws.onclose = () => {
        this.ws = null
        console.log('[ths-linker-bridge] disconnected')
        this.scheduleReconnect()
      }

      ws.onerror = () => {
        console.log('[ths-linker-bridge] error')
      }

      ws.onmessage = (ev) => {
        this.handleMessage(String(ev.data))
      }
    } catch (error) {
      console.log('[ths-linker-bridge] connect failed', error)
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (!this.shouldConnect || this.reconnectTimer) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.open()
    }, RECONNECT_MS)
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private emitCode(code: string) {
    const next = String(code || '').trim()
    if (!next || next === this.lastCode || !this.io) return
    this.lastCode = next
    console.log('[ths-linker-bridge] stock', next)
    this.io.emit(SOCKET_EVENTS.serverSetStockCode, next)
  }

  private handleMessage(raw: string) {
    let msg: any
    try {
      msg = JSON.parse(raw)
    } catch {
      return
    }

    if (msg?.type === 'stock' && typeof msg.code === 'string') {
      this.emitCode(msg.code)
      return
    }

    if (msg?.type === 'instances' && msg.stocks && typeof msg.stocks === 'object') {
      for (const info of Object.values(msg.stocks) as Array<{ code?: string }>) {
        if (info?.code) this.emitCode(info.code)
      }
    }
  }
}

const bridge = new ThsLinkerBridge()

export function handleThsLinkerBridge(client: Socket, io: Server) {
  client.on('thsLinkerSync', (data: ThsLinkerSyncPayload) => {
    if (data?.enabled) {
      bridge.start(io, data.url)
    } else {
      bridge.stop()
    }
  })
}

export default {
  handleThsLinkerBridge,
}
