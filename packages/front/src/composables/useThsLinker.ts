import { Ref } from 'vue'

import { useGlobalStore } from '@/stores/global'
import useSetStockCode from '@/composables/useSetStockCode'
import { IThsStockPayload, thsLinkerClient } from '@/composables/thsLinkerClient'
import type { IStocksoftWindow } from '@/server/handlers/stocksoft-link'

let initialized = false
const connected = ref(false)

function isLinkedStockEvent(payload: IThsStockPayload, linked: IStocksoftWindow[]) {
  if (!linked?.length) return true

  const linkedIds = new Set(linked.map((item) => item.id).filter(Boolean) as string[])
  const linkedDirs = new Set(linked.map((item) => item.ths_dir).filter(Boolean) as string[])
  // 尚未勾选带 ths 标识的实例时，接受全部推送
  if (!linkedIds.size && !linkedDirs.size) return true

  if (payload.ths_dir && linkedDirs.has(payload.ths_dir)) return true
  return !!payload.instances?.some((item) => linkedIds.has(String(item.id)) || linkedDirs.has(item.ths_dir))
}

function ensureHandlers() {
  if (initialized) return
  initialized = true

  const global = useGlobalStore()
  const { update } = useSetStockCode()

  thsLinkerClient.onConnected((value) => {
    connected.value = value
  })

  // 实时监听 ths-linker 推送的股票代码，驱动本软件响应
  thsLinkerClient.onStock((payload) => {
    if (global.linkMode !== 'thsLinker') return

    if (payload.ths_dir || payload.instances?.length) {
      const nextList = global.stocksofts.map((item) => {
        const sameDir = payload.ths_dir && item.ths_dir === payload.ths_dir
        const sameInst = payload.instances?.some((inst) => String(inst.id) === item.id)
        return sameDir || sameInst ? { ...item, code: payload.code } : item
      })
      global.setStocksofts(nextList)
    }

    if (!isLinkedStockEvent(payload, global.linkedStocksofts)) return
    update(payload.code)
  })

  thsLinkerClient.onInstances((list) => {
    if (global.linkMode !== 'thsLinker') return
    global.setStocksofts(list)
  })
}

export default function useThsLinker(): {
  connected: Ref<boolean>
  connect: () => void
  disconnect: () => void
  list: () => void
  jump: (code: string, target?: string) => void
  syncByMode: () => void
} {
  ensureHandlers()
  const global = useGlobalStore()

  function connect() {
    ensureHandlers()
    thsLinkerClient.connect(global.thsLinkerWsUrl)
    connected.value = thsLinkerClient.connected
  }

  function disconnect() {
    thsLinkerClient.disconnect()
    connected.value = false
  }

  function list() {
    thsLinkerClient.list()
  }

  function jump(code: string, target: string = 'all') {
    thsLinkerClient.jump(code, target)
  }

  function syncByMode() {
    if (global.linkMode === 'thsLinker') {
      connect()
    } else {
      disconnect()
    }
  }

  return {
    connected,
    connect,
    disconnect,
    list,
    jump,
    syncByMode,
  }
}
