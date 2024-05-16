import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IYiDong, yiDongStrNameMap } from '@awamstock/model'

@Controller('yi-dongs')
export class YiDongController extends BasicController<IYiDong> {
  constructor(@InjectModel('YiDong') private myModel) {
    super(myModel, { strNameMap: yiDongStrNameMap, supportedListQuery: ['date'], supportedGetParam: ['_id', 'date'], _sort: '-time' })
  }
}
