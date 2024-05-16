import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { InjectModel } from '@nestjs/mongoose'

import {  omitQuery } from '@awamstock/shared'
import { FilterQuery } from '@awamstock/model/mongoose'
import { longhuQuery } from '@awamstock/model/querys'
import { IDepartmentTrade, departmentTradeStrNameMap, PipelineProp } from '@awamstock/model'
import { BasicController } from '../../lib/contoller'

@Controller('flows')
export class FlowController extends BasicController<IDepartmentTrade> {
  constructor(@InjectModel('DepartmentTrade') private myModel) {
    super(myModel, {
      strNameMap: departmentTradeStrNameMap,
      supportedListQuery: ['date', 'name', 'code', 'department'],
      supportedGetParam: ['_id', 'date', 'name', 'code', 'department'],
      _sort: {
        date: -1.0,
        net: -1.0,
      },
    })
  }

  @Get('longhu')
  public async longhu(@Req() req: Request) {
    const { query: parsedDbQuery, buildinDbQuery } = this.parseDbQuery(req.query)
    const { sort, strNameMap } = buildinDbQuery
    const { min_buy, min_sell } = parsedDbQuery

    const dbQuery = omitQuery<FilterQuery<IDepartmentTrade>>({
      ...parsedDbQuery,
      buy: { $gte: min_buy },
      sell: { $gte: min_sell },
    })

    return {
      data: await this.model.aggregate(longhuQuery(dbQuery as PipelineProp<IDepartmentTrade>)).sort(sort),
      strNameMap,
    }
  }
}
