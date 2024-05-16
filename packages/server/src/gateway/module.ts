import { Module, Global } from '@nestjs/common'
import { SocketGateway, FrontSocketGateway } from './socket'
import { SocketService } from './socket.service'
import { ObservableModule } from '../reactive/observable.module'

@Global()
@Module({
  imports: [ObservableModule],
  providers: [SocketGateway, FrontSocketGateway, SocketService],
  exports: [SocketService],
})
export class GatewayModule {}
