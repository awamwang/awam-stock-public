import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IMoodBlockItem, moodBlockItemStrNameMap } from '@awamstock/model'

@Controller('mood-blocks')
export class MoodBlockItemController extends BasicController<IMoodBlockItem> {
  constructor(@InjectModel('MoodBlockItem') private myModel) {
    super(myModel, { strNameMap: moodBlockItemStrNameMap, supportedListQuery: ['date'], supportedGetParam: ['_id', 'date'] })
  }
}
