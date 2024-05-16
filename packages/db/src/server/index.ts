import getSocketClient, { SOCKET_EVENTS, ISocketData, close as closeSocketClient } from './socket-client'
import getSocketServer, { close as closeSocketServer } from './socket-server'

export async function initSocket() {
  await getSocketClient()
  await getSocketServer()
}

export async function closeSocket() {
  await closeSocketClient()
  await closeSocketServer()
}

export async function sendSocketData(data: ISocketData<any>) {
  const socketClient = await getSocketClient()
  const socketServer = await getSocketServer()

  socketClient && socketClient.emit(SOCKET_EVENTS.dbData, data)
  socketServer && socketServer.emit(SOCKET_EVENTS.dbData, data)
}
