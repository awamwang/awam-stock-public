import { contextBridge, ipcRenderer, Event } from 'electron'

export interface MessageListener {
  (event: Event, ...args: unknown[]): void
}

const messageHandlers: Record<string, MessageListener> = {}

ipcRenderer.on('message', (ev, message, ...args) => {
  const listener = messageHandlers[message]
  listener && listener(ev, ...args)
})

export const electronAPI = {
  checkForUpdate: () => ipcRenderer.send('check-update'),
  onDownloadProgress: (listener: MessageListener) => {
    ipcRenderer.on('download-progress', listener)
  },
  onMessage: (type: string, listener: MessageListener) => {
    messageHandlers[type] = listener
  },
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
