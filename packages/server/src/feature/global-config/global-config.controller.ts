import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { CrudController } from '../../lib/contoller'
import { IGlobalConfig, globalConfigStrNameMap } from '@awamstock/model'

@Controller('global-configs')
export class GlobalConfigController extends CrudController<IGlobalConfig> {
  constructor(@InjectModel('GlobalConfig') private myModel) {
    super(myModel, { strNameMap: globalConfigStrNameMap, supportedListQuery: ['date', 'type'], supportedGetParam: ['_id', 'date', 'type'] })
  }
}
