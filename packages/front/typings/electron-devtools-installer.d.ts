declare module 'electron-devtools-installer' {
  import type { Extension, LoadExtensionOptions, Session } from 'electron'

  export interface ExtensionReference {
    id: string
  }

  export interface InstallExtensionOptions {
    forceDownload?: boolean
    loadExtensionOptions?: LoadExtensionOptions
    session?: Session
  }

  export function installExtension(extensionReference: Array<ExtensionReference | string>, options?: InstallExtensionOptions): Promise<Extension[]>
  export function installExtension(extensionReference: ExtensionReference | string, options?: InstallExtensionOptions): Promise<Extension>

  export default installExtension

  export const EMBER_INSPECTOR: ExtensionReference
  export const REACT_DEVELOPER_TOOLS: ExtensionReference
  export const BACKBONE_DEBUGGER: ExtensionReference
  export const JQUERY_DEBUGGER: ExtensionReference
  export const VUEJS_DEVTOOLS: ExtensionReference
  export const VUEJS_DEVTOOLS_BETA: ExtensionReference
  export const REDUX_DEVTOOLS: ExtensionReference
  export const MOBX_DEVTOOLS: ExtensionReference
}
