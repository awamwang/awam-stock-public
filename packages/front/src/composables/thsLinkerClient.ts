import type { IStocksoftWindow } from '@/server/handlers/stocksoft-link'

export type LinkMode = 'stocksoftLink' | 'thsLinker'

export const DEFAULT_THS_LINKER_WS_URL = 'ws://127.0.0.1:8765'

export interface IThsInstance {
  id: string
  pid: number
  hwnd: number
  title: string
  ths_dir: string
  listen?: boolean
  send?: boolean
}

export interface IThsStockMessage {
  type: 'stock'
  ths_dir: string
  code: string
  market_id?: string
  symbol?: string
  instances?: IThsInstance[]
}

export type IThsStockInfo = { code: string; market_id?: string; symbol?: string }

export interface IThsInstancesMessage {
  type: 'instances'
  instances: IThsInstance[]
  stocks?: Record<string, IThsStockInfo>
}

export interface IThsStockPayload {
  code: string
  ths_dir?: string
  market_id?: string
  symbol?: string
  instances?: IThsInstance[]
}

type ThsMessage = IThsStockMessage | IThsInstancesMessage | { type: string; [key: string]: any }

type StockHandler = (payload: IThsStockPayload) => void
type InstancesHandler = (list: IStocksoftWindow[], stocks?: IThsInstancesMessage['stocks']) => void
type ConnectedHandler = (connected: boolean) => void

const RECONNECT_MS = 3000

function mapInstances(instances: IThsInstance[] = [], stocks?: IThsInstancesMessage['stocks']): IStocksoftWindow[] {
  return instances.map((item) => ({
    id: String(item.id),
    hwnd: String(item.hwnd),
    name: item.title,
    ths_dir: item.ths_dir,
    code: stocks?.[item.ths_dir]?.code,
  }))
}

class ThsLinkerClient {
  private ws: WebSocket | null = null
  private url = DEFAULT_THS_LINKER_WS_URL
  private shouldConnect = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private stockHandlers = new Set<StockHandler>()
  private instancesHandlers = new Set<InstancesHandler>()
  private connectedHandlers = new Set<ConnectedHandler>()
  connected = false

  onStock(handler: StockHandler) {
    this.stockHandlers.add(handler)
    return () => this.stockHandlers.delete(handler)
  }

  onInstances(handler: InstancesHandler) {
    this.instancesHandlers.add(handler)
    return () => this.instancesHandlers.delete(handler)
  }

  onConnected(handler: ConnectedHandler) {
    this.connectedHandlers.add(handler)
    handler(this.connected)
    return () => this.connectedHandlers.delete(handler)
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
    this.setConnected(false)
  }

  list() {
    this.send({ type: 'list' })
  }

  jump(code: string, target: string = 'all') {
    this.send({ type: 'jump', code, target })
  }

  private setConnected(value: boolean) {
    if (this.connected === value) return
    this.connected = value
    this.connectedHandlers.forEach((handler) => handler(value))
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
        this.setConnected(true)
        console.log('[ths-linker] connected', this.url)
        // 主动拉取一次实例快照，确保界面与当前股票同步
        this.list()
      }

      ws.onclose = () => {
        this.setConnected(false)
        this.ws = null
        console.log('[ths-linker] disconnected')
        this.scheduleReconnect()
      }

      ws.onerror = (err) => {
        console.log('[ths-linker] error', err)
      }

      ws.onmessage = (ev) => {
        this.handleMessage(String(ev.data))
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

  private emitStock(payload: IThsStockPayload) {
    const code = String(payload.code || '').trim()
    if (!code) return
    const next = { ...payload, code }
    this.stockHandlers.forEach((handler) => handler(next))
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
      this.emitStock({
        code: msg.code,
        ths_dir: typeof msg.ths_dir === 'string' ? msg.ths_dir : undefined,
        market_id: typeof msg.market_id === 'string' ? msg.market_id : undefined,
        symbol: typeof msg.symbol === 'string' ? msg.symbol : undefined,
        instances: Array.isArray(msg.instances) ? msg.instances : undefined,
      })
      return
    }

    if (msg.type === 'instances' && Array.isArray(msg.instances)) {
      const stocks: IThsInstancesMessage['stocks'] = msg.stocks && typeof msg.stocks === 'object' ? (msg.stocks as Record<string, IThsStockInfo>) : undefined
      const instances = msg.instances as IThsInstance[]
      const list = mapInstances(instances, stocks)
      this.instancesHandlers.forEach((handler) => handler(list, stocks))

      // 连接/list 快照中的缓存股票：补推一次，便于软件立即响应当前代码
      if (stocks) {
        Object.entries(stocks).forEach(([ths_dir, info]) => {
          if (!info?.code) return
          const dirInstances = instances.filter((item) => item.ths_dir === ths_dir)
          this.emitStock({
            code: info.code,
            ths_dir,
            market_id: info.market_id,
            symbol: info.symbol,
            instances: dirInstances.length ? dirInstances : instances,
          })
        })
      }
    }
  }
}

export const thsLinkerClient = new ThsLinkerClient()
