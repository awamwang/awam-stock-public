import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'

@Injectable()
export class SocketService {
  public socket: Server | null = null
  public frontSocket: Server | null = null
}
