import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IGlobalMarket, globalMarketStrNameMap } from '@awamstock/model'

@Controller('global-markets')
export class GlobalMarketController extends BasicController<IGlobalMarket> {
  constructor(@InjectModel('GlobalMarket') private myModel) {
    super(myModel, { strNameMap: globalMarketStrNameMap, supportedListQuery: ['date', 'code', 'name'], supportedGetParam: ['_id', 'date', 'code', 'name'] })
  }
}
