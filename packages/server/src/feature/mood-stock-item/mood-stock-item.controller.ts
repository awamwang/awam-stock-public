import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IMoodStockItem, moodStockItemStrNameMap } from '@awamstock/model'

@Controller('mood-stocks')
export class MoodStockItemController extends BasicController<IMoodStockItem> {
  constructor(@InjectModel('MoodStockItem') private myModel) {
    super(myModel, { strNameMap: moodStockItemStrNameMap, supportedListQuery: ['date'], supportedGetParam: ['_id', 'date'] })
  }
}
