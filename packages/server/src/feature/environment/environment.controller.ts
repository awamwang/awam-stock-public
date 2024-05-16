import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IEnvironment, environmentStrNameMap } from '@awamstock/model'

@Controller('environments')
export class EnvironmentController extends BasicController<IEnvironment> {
  constructor(@InjectModel('Environment') private myModel) {
    super(myModel, { strNameMap: environmentStrNameMap, supportedListQuery: ['date'], supportedGetParam: ['_id', 'date'] })
  }
}
