import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { InjectModel } from '@nestjs/mongoose'

import { dingPanQuery } from '@awamstock/model/querys'
import { IStock, IDingPanStock, stockStrNameMap } from '@awamstock/model'
import { RiskyLonghuService } from '../risky-longhu/risky-longhu.service'
import { BasicController } from '../../lib/contoller'

@Controller('stocks')
export class StockController extends BasicController<IStock> {
  constructor(@InjectModel('Stock') private myModel, private readonly riskyLonghuService: RiskyLonghuService) {
    super(myModel, {
      strNameMap: stockStrNameMap,
      supportedListQuery: ['date', 'name', 'code', 'fullname'],
      supportedGetParam: ['_id', 'date', 'name', 'code', 'fullname'],
      _sort: 'code',
    })
  }

  @Get('ding-pan')
  public async dingPan(@Req() req: Request) {
    const { query, buildinDbQuery } = this.parseDbQuery(req.query)
    const { sort } = buildinDbQuery
    // const date = ctx.app.ob.global.lastTradeDate.getValue()

    const res: IDingPanStock[] = await this.model
      .aggregate(
        dingPanQuery(query, {
          stockPoolMatches: { date: query.date },
        })
      )
      .sort(sort)
    const riskyLonghuList = (await this.riskyLonghuService.getOne()).list || []
    // const moodStock = await model..findOne().sort({ date: -1 })
    res.forEach((stock) => {
      stock.risky = riskyLonghuList.includes(stock.code)
    })

    return {
      data: res,
    }
  }
}
