import startSocketServer from './socket'
import startHttpServer from './http'

export function startServer() {
  const io = startSocketServer()
  startHttpServer(io)
}
startServer()

export default startServer
