import { ISocketMessage } from '@awamstock/shared/type'
import { SOCKET_EVENTS } from '@awamstock/shared/global'
import useNotify from '@/composables/func/useNotify'

export default {
  sockets: {
    [SOCKET_EVENTS.severMessage](message: ISocketMessage) {
      if (message.type === 'global_notify') {
        useNotify().notify(message.data as string, { duration: 3 })
      }
    },
  },
}
