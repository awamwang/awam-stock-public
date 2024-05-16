import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { ISafeScore, safeScoreStrNameMap } from '@awamstock/model'

@Controller('safe-scores')
export class SafeScoreController extends BasicController<ISafeScore> {
  constructor(@InjectModel('SafeScore') private myModel) {
    super(myModel, {
      strNameMap: safeScoreStrNameMap,
      supportedListQuery: ['date', 'code', 'name', 'level', 'score'],
      supportedGetParam: ['_id', 'date', 'code', 'name', 'level', 'score'],
    })
  }

  @Get()
  async list(@Req() req: Request) {
    this.extraListQuery = { score: { $gte: req.query.min_score, $lte: req.query.max_score } }

    return await super.list(req)
  }
}
