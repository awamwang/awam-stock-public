import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { IDepartmentTrade, departmentTradeStrNameMap } from '@awamstock/model'

@Controller('department-trades')
export class DepartmentTradeController extends BasicController<IDepartmentTrade> {
  constructor(@InjectModel('DepartmentTrade') private myModel) {
    super(myModel, {
      strNameMap: departmentTradeStrNameMap,
      supportedListQuery: ['date', 'name', 'code', 'department'],
      supportedGetParam: ['_id', 'date', 'name', 'code', 'department'],
    })
  }
}
