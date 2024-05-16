import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MoodStockItemSchema } from '@awamstock/model'
import { MoodStockItemService } from './mood-stock-item.service'
import { MoodStockItemController } from './mood-stock-item.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'MoodStockItem', schema: MoodStockItemSchema }])],
  providers: [MoodStockItemService],
  controllers: [MoodStockItemController],
})
export class MoodStockItemModule {}
