import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IBeforeOpenStock, beforeOpenStockStrNameMap } from '@awamstock/model'

@Controller('before-open-stocks')
export class BeforeOpenStockController extends BasicController<IBeforeOpenStock> {
  constructor(@InjectModel('BeforeOpenStock') private myModel) {
    super(myModel, { strNameMap: beforeOpenStockStrNameMap, supportedListQuery: ['date'], supportedGetParam: ['_id', 'date'] })
  }
}
