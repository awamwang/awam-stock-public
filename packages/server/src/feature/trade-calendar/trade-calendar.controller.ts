import { Controller } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { BasicController } from '../../lib/contoller'
import { ITradeCalendar, tradeCalendarStrNameMap } from '@awamstock/model'

@Controller('trade-calendars')
export class TradeCalendarController extends BasicController<ITradeCalendar> {
  constructor(@InjectModel('TradeCalendar') private myModel) {
    super(myModel, { strNameMap: tradeCalendarStrNameMap, supportedListQuery: ['date', 'open'], supportedGetParam: ['_id', 'date', 'open'] })
  }
}
