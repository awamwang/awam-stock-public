import type { IStocksoftWindow } from '@/server/handlers/stocksoft-link'

export type LinkMode = 'stocksoftLink' | 'thsLinker'

export const DEFAULT_THS_LINKER_WS_URL = 'ws://127.0.0.1:8765'

export interface IThsInstance {
  id: string
  pid: number
  hwnd: number
  title: string
  ths_dir: string
}

export interface IThsStockMessage {
  type: 'stock'
  ths_dir: string
  code: string
  market_id?: string
  symbol?: string
  instances?: IThsInstance[]
}

export interface IThsInstancesMessage {
  type: 'instances'
  instances: IThsInstance[]
  stocks?: Record<string, { code: string; market_id?: string; symbol?: string }>
}

type ThsMessage = IThsStockMessage | IThsInstancesMessage | { type: string; [key: string]: any }

type StockHandler = (code: string) => void
type InstancesHandler = (list: IStocksoftWindow[]) => void

const RECONNECT_MS = 3000

function mapInstances(instances: IThsInstance[] = []): IStocksoftWindow[] {
  return instances.map((item) => ({
    id: String(item.id),
    hwnd: String(item.hwnd),
    name: item.title,
    ths_dir: item.ths_dir,
  }))
}

class ThsLinkerClient {
  private ws: WebSocket | null = null
  private url = DEFAULT_THS_LINKER_WS_URL
  private shouldConnect = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private stockHandlers = new Set<StockHandler>()
  private instancesHandlers = new Set<InstancesHandler>()
  connected = false

  onStock(handler: StockHandler) {
    this.stockHandlers.add(handler)
    return () => this.stockHandlers.delete(handler)
  }

  onInstances(handler: InstancesHandler) {
    this.instancesHandlers.add(handler)
    return () => this.instancesHandlers.delete(handler)
  }

  setUrl(url: string) {
    this.url = url || DEFAULT_THS_LINKER_WS_URL
  }

  connect(url?: string) {
    if (url) {
      this.setUrl(url)
    }
    this.shouldConnect = true
    this.clearReconnectTimer()
    this.open()
  }

  disconnect() {
    this.shouldConnect = false
    this.clearReconnectTimer()
    if (this.ws) {
      this.ws.onopen = null
      this.ws.onclose = null
      this.ws.onerror = null
      this.ws.onmessage = null
      this.ws.close()
      this.ws = null
    }
    this.connected = false
  }

  list() {
    this.send({ type: 'list' })
  }

  jump(code: string, target: string = 'all') {
    this.send({ type: 'jump', code, target })
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
        this.connected = true
        console.log('[ths-linker] connected', this.url)
      }

      ws.onclose = () => {
        this.connected = false
        this.ws = null
        console.log('[ths-linker] disconnected')
        this.scheduleReconnect()
      }

      ws.onerror = (err) => {
        console.log('[ths-linker] error', err)
      }

      ws.onmessage = (ev) => {
        this.handleMessage(ev.data)
      }
    } catch (error) {
      console.log('[ths-linker] connect failed', error)
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

  private send(payload: Record<string, unknown>) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('[ths-linker] send skipped, not connected', payload)
      return
    }
    this.ws.send(JSON.stringify(payload))
  }

  private handleMessage(raw: string) {
    let msg: ThsMessage
    try {
      msg = JSON.parse(raw)
    } catch (error) {
      console.log('[ths-linker] invalid message', raw, error)
      return
    }

    if (msg.type === 'stock' && typeof msg.code === 'string' && msg.code) {
      this.stockHandlers.forEach((handler) => handler(msg.code))
      if (Array.isArray(msg.instances)) {
        const list = mapInstances(msg.instances)
        this.instancesHandlers.forEach((handler) => handler(list))
      }
      return
    }

    if (msg.type === 'instances' && Array.isArray(msg.instances)) {
      const list = mapInstances(msg.instances)
      this.instancesHandlers.forEach((handler) => handler(list))
    }
  }
}

export const thsLinkerClient = new ThsLinkerClient()
