import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { BeforeOpenStockSchema } from '@awamstock/model'
import { BeforeOpenStockService } from './before-open-stock.service'
import { BeforeOpenStockController } from './before-open-stock.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'BeforeOpenStock', schema: BeforeOpenStockSchema }])],
  providers: [BeforeOpenStockService],
  controllers: [BeforeOpenStockController],
})
export class BeforeOpenStockModule {}
