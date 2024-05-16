import { Injectable, Logger } from '@nestjs/common'
import { Observable, filter, scheduled, queueScheduler, map } from 'rxjs'
import { IGlobalConfig, IGlobalConfigSocketData } from '@awamstock/model'
import { GlobalObservableService } from '../observable/global'
import { SocketHelper } from '../../provider/socket.helper'

@Injectable()
export class GlobalSubscribeService {
  private readonly logger = new Logger(GlobalSubscribeService.name)

  constructor(private readonly ob: GlobalObservableService, private socketHelper: SocketHelper) {
    ob.lastTradeDate.subscribe((v) => {
      this.logger.log('[data] lastTradeDate:', v)
      socketHelper.sendFrontData({ name: 'lastTradeDate', data: v })
    })

    this.logger.log(`GlobalSubscribeService inited`)
  }
}
