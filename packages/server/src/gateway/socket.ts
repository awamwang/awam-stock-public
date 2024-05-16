import config, { SOCKET_EVENTS } from '@awamstock/shared/config'

import { Logger } from '@nestjs/common'
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { ITypeSocketData } from '@awamstock/model'
import { SocketService } from './socket.service'
import {
  CommonObservableService,
  GlobalObservableService,
  MoodBlockStockObservableService,
  MarketMessageObservableService,
  RadarObservableService,
  YiDongObservableService,
} from '../reactive/observable.module'

@WebSocketGateway({
  // transports: ['websocket', 'polling'],
  cors: {
    origin: config.front.url,
    methods: 'GET,POST',
    transports: ['websocket', 'polling'],
    credentials: true,
  },
  preflightContinue: false,
  optionsSuccessStatus: 204,
})
export class SocketGateway {
  private logger: Logger = new Logger(SocketGateway.name)
  @WebSocketServer() public server: Server | null = null

  constructor(
    private socketService: SocketService,
    private readonly commonOb: CommonObservableService,
    private readonly globalOb: GlobalObservableService,
    private readonly moodBlockStockOb: MoodBlockStockObservableService,
    private readonly marketMessageOb: MarketMessageObservableService,
    private readonly radarOb: RadarObservableService,
    private readonly yiDongOb: YiDongObservableService
  ) {}

  @SubscribeMessage(SOCKET_EVENTS.dbData)
  handleDbData(@MessageBody() data: ITypeSocketData, @ConnectedSocket() client: Socket) {
    // console.log(SOCKET_EVENTS.dbData, data.name)

    // const ob: any = {}

    switch (data.name) {
      case 'lastTradeDate':
        return this.globalOb.lastTradeDate.next(data.data.value as string)
      case '短线精灵':
        return this.radarOb.update(data.data)
      case '大盘异动':
        return this.yiDongOb.update(data.data)
      case '市场消息':
        return this.marketMessageOb.update(data.data)
      case '板块人气个股':
        return this.moodBlockStockOb.update(data.data)
      default:
        return this.commonOb.ob.next(data)
    }
  }

  afterInit(server: Server) {
    this.socketService.socket = server
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  // @SubscribeMessage('events')
  // onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
  //   const event = 'events'
  //   const response = [1, 2, 3]

  //   return from(response).pipe(map((data) => ({ event, data })))
  // }
}

@WebSocketGateway({
  namespace: '/front',
  // transports: ['websocket', 'polling'],
  cors: {
    origin: config.front.url,
    methods: 'GET,POST',
    transports: ['websocket', 'polling'],
    credentials: true,
  },
  preflightContinue: false,
  optionsSuccessStatus: 204,
})
export class FrontSocketGateway {
  private logger: Logger = new Logger(FrontSocketGateway.name)
  @WebSocketServer() public server: Server | null = null

  constructor(private socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.frontSocket = server
  }

  // handleDisconnect(client: Socket) {
  //   this.logger.log(`Client disconnected: ${client.id}`)
  // }

  // handleConnection(client: Socket, ...args: any[]) {
  //   this.logger.log(`Client connected: ${client.id}`)
  // }
}
