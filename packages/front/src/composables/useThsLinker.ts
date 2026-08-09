import { Ref } from 'vue'

import { useGlobalStore } from '@/stores/global'
import useSetStockCode from '@/composables/useSetStockCode'
import { thsLinkerClient } from '@/composables/thsLinkerClient'

let initialized = false
const connected = ref(false)
let connectedPollTimer: ReturnType<typeof setInterval> | null = null

function syncConnected() {
  connected.value = thsLinkerClient.connected
}

function startConnectedPoll() {
  if (connectedPollTimer) return
  connectedPollTimer = setInterval(syncConnected, 500)
}

function stopConnectedPoll() {
  if (connectedPollTimer) {
    clearInterval(connectedPollTimer)
    connectedPollTimer = null
  }
  syncConnected()
}

function ensureHandlers() {
  if (initialized) return
  initialized = true

  const global = useGlobalStore()
  const { update } = useSetStockCode()

  thsLinkerClient.onStock((code) => {
    update(code)
  })

  thsLinkerClient.onInstances((list) => {
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
    startConnectedPoll()
    syncConnected()
  }

  function disconnect() {
    thsLinkerClient.disconnect()
    stopConnectedPoll()
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
