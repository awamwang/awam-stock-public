import { Injectable, Logger } from '@nestjs/common'
import { _ } from '@awamstock/shared/browser'
import { filter } from 'rxjs'
import { PlainDataModel } from '@awamstock/model'
import { CommonObservableService } from '../observable/common'
import { SocketHelper } from '../../provider/socket.helper'

@Injectable()
export class BeforeOpenStockSubscribeService {
  private readonly logger = new Logger(BeforeOpenStockSubscribeService.name)

  constructor(private readonly commonOb: CommonObservableService, private socketHelper: SocketHelper) {
    this.commonOb.ob.pipe(filter((v) => v.name === '竞价个股异动')).subscribe((v) => {
      this.socketHelper.sendFrontData<PlainDataModel>(v)
    })
    this.logger.log(`BeforeOpenStockSubscribeService inited`)
  }
}
