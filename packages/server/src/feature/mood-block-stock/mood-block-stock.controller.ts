import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IMoodBlockStock, moodBlockStockStrNameMap } from '@awamstock/model'

@Controller('mood-block-stocks')
export class MoodBlockStockController extends BasicController<IMoodBlockStock> {
  constructor(@InjectModel('MoodBlockStock') private myModel) {
    super(myModel, { strNameMap: moodBlockStockStrNameMap, supportedListQuery: ['date'], supportedGetParam: ['_id', 'date'], _sort: '-time' })
  }
}
