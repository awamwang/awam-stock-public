import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IBlock, blockStrNameMap } from '@awamstock/model'

@Controller('blocks')
export class BlockController extends BasicController<IBlock> {
  constructor(@InjectModel('Block') private myModel) {
    super(myModel, { strNameMap: blockStrNameMap, supportedListQuery: ['name', 'code', 'type'], supportedGetParam: ['_id', 'name', 'code', 'type'] })
  }
}
