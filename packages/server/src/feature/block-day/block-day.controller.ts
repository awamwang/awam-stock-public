import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IBlockDay, blockDayStrNameMap } from '@awamstock/model'

@Controller('block-days')
export class BlockDayController extends BasicController<IBlockDay> {
  constructor(@InjectModel('BlockDay') private myModel) {
    super(myModel, { strNameMap: blockDayStrNameMap, supportedListQuery: ['date', 'code'], supportedGetParam: ['_id', 'date', 'code'] })
  }
}
