import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IRiskyLonghu, riskyLonghuStrNameMap } from '@awamstock/model'

@Controller('risky-longhus')
export class RiskyLonghuController extends BasicController<IRiskyLonghu> {
  constructor(@InjectModel('RiskyLonghu') private myModel) {
    super(myModel, { strNameMap: riskyLonghuStrNameMap, supportedListQuery: ['date'], supportedGetParam: ['_id', 'date'] })
  }
}
