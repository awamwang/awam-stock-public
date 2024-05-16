import { Module, Global } from '@nestjs/common'

import { ResponseHelper } from './response.helper'
import { SocketHelper } from './socket.helper'

@Global()
@Module({
  providers: [ResponseHelper, SocketHelper],
  exports: [ResponseHelper, SocketHelper],
})
export class HelperModule {}
