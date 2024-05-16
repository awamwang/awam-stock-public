import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { TradeCalendarSchema } from '@awamstock/model'
import { TradeCalendarService } from './trade-calendar.service'
import { TradeCalendarController } from './trade-calendar.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'TradeCalendar', schema: TradeCalendarSchema }])],
  providers: [TradeCalendarService],
  controllers: [TradeCalendarController],
})
export class TradeCalendarModule {}
