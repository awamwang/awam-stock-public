import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IStockPool, stockPoolStrNameMap } from '@awamstock/model'

@Controller('stock-pools')
export class StockPoolController extends BasicController<IStockPool> {
  constructor(@InjectModel('StockPool') private myModel) {
    super(myModel, { strNameMap: stockPoolStrNameMap, supportedListQuery: ['date'], supportedGetParam: ['_id', 'date'], _sort: '-updatedAt' })
  }
}
