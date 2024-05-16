import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IMarketMessage, marketMessageStrNameMap } from '@awamstock/model'

@Controller('market-messages')
export class MarketMessageController extends BasicController<IMarketMessage> {
  constructor(@InjectModel('MarketMessage') private myModel) {
    super(myModel, { strNameMap: marketMessageStrNameMap, supportedListQuery: ['date'], supportedGetParam: ['_id', 'date'], _sort: '-time' })
  }
}
