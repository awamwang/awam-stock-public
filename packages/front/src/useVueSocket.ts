import { App } from 'vue'
import VueSocketIOExt from '@awamwang/vue-socket.io-extended'
import io from 'socket.io-client'
import env from './utils/env'

export default function useVueSocket(app: App) {
  app.use(
    VueSocketIOExt,
    io(`https://${env.serverHost}:${env.serverPort}/front`, {
      // transports: ['websocket'],
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 100000,
    }),
    {}
  )
}
