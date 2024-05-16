import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { InjectModel } from '@nestjs/mongoose'

import { CrudController } from '../../lib/contoller'
import { IFocusedDepartment, focusedDepartmentStrNameMap } from '@awamstock/model'

@Controller('focused-departments')
export class FocusedDepartmentController extends CrudController<IFocusedDepartment> {
  constructor(@InjectModel('FocusedDepartment') private myModel) {
    super(myModel, { strNameMap: focusedDepartmentStrNameMap, supportedListQuery: ['date', 'name', 'type'], supportedGetParam: ['_id', 'date', 'name', 'type'] })
  }

  @Get()
  async list(@Req() req: Request) {
    this.extraListQuery = { power: { $gte: req.query.min_power, $lte: req.query.max_power } }

    return await super.list(req)
  }
}
