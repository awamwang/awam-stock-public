import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DepartmentTradeSchema } from '@awamstock/model'
import { DepartmentTradeService } from './department-trade.service'
import { DepartmentTradeController } from './department-trade.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'DepartmentTrade', schema: DepartmentTradeSchema }])],
  providers: [DepartmentTradeService],
  controllers: [DepartmentTradeController],
})
export class DepartmentTradeModule {}
