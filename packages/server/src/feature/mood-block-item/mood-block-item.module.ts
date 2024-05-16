import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MoodBlockItemSchema } from '@awamstock/model'
import { MoodBlockItemService } from './mood-block-item.service'
import { MoodBlockItemController } from './mood-block-item.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'MoodBlockItem', schema: MoodBlockItemSchema }])],
  providers: [MoodBlockItemService],
  controllers: [MoodBlockItemController],
})
export class MoodBlockItemModule {}
