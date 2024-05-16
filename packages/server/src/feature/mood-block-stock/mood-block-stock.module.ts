import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MoodBlockStockSchema } from '@awamstock/model'
import { MoodBlockStockService } from './mood-block-stock.service'
import { MoodBlockStockController } from './mood-block-stock.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'MoodBlockStock', schema: MoodBlockStockSchema }])],
  providers: [MoodBlockStockService],
  controllers: [MoodBlockStockController],
})
export class MoodBlockStockModule {}
