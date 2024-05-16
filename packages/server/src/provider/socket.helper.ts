import { Injectable, Global } from '@nestjs/common'
import { PlainData, SOCKET_EVENTS, ISocketData, ISocketMessage } from '@awamstock/shared'
import { SocketService } from '../gateway/socket.service'

@Injectable()
export class SocketHelper {
  constructor(private socketService: SocketService) {}

  sendFrontData<T extends PlainData = PlainData>(data: ISocketData<T>, namespace = 'front/') {
    return this.socketService.frontSocket?.emit(SOCKET_EVENTS.serverData, data)
  }
  sendFrontMessage(data: ISocketMessage) {
    return this.socketService.frontSocket?.emit(SOCKET_EVENTS.severMessage, data)
  }
  sendFrontGlobalNotify(data: string) {
    return this.sendFrontMessage({
      type: 'global_notify',
      code: 1,
      data,
    })
  }
}
