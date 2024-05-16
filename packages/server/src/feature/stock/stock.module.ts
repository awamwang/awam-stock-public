import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { StockSchema } from '@awamstock/model'
import { StockService } from './stock.service'
import { StockController } from './stock.controller'
import { RiskyLonghuModule } from '../risky-longhu/risky-longhu.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Stock', schema: StockSchema }]), RiskyLonghuModule],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}
