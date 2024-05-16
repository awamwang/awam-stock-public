import { Vue } from 'vue-class-component'

import { ISocketMessage } from '@awamstock/shared/type'
import { SOCKET_EVENTS } from '@awamstock/shared/global'
import useNotify from '@/composables/func/useNotify'

@VueOptions({})
export default class SocketMessageMixin extends Vue {
  // @Socket()
  // connect() {
  //   console.log('server socket connected')
  // }
  @Socket(SOCKET_EVENTS.severMessage)
  onSeverMessage(message: ISocketMessage) {
    if (message.type === 'global_notify') {
      useNotify().notify(message.data as string, { duration: 3 })
    }
  }
}
