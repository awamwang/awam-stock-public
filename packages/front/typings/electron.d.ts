import { electronAPI } from '../electron/preload/index'

export type IElectronAPI = typeof electronAPI
declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
