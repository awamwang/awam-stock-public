import { Ref } from 'vue'
import { SocketIOClient, socketHandler } from 'socket.io-client'
import { IVueFormatters } from '../src/utils/vue/formatters'
import { _ } from '@awamstock/shared/browser'

declare global {
  interface RouterNext<T extends Vue = Vue> {
    (to?: (vm: T) => any): void
  }
}

declare module 'vue' {
  interface Expose {
    (exposed?: Record<string, any>): void
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    _: typeof _
    $filters: IVueFormatters
    $socket: SocketIOClient.Socket
    sockets: {
      subscribe(eventName: string, handler: socketHandler<Vue>): void
      unsubscribe(eventName: string): void
    }
  }
}

declare module '@awamstock/model' {
  export type RefStrNameMap<T> = Ref<IStrNameMap<T>>
}

declare module 'vue-router' {}
