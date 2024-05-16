import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { BlockDaySchema } from '@awamstock/model'
import { BlockDayService } from './block-day.service'
import { BlockDayController } from './block-day.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'BlockDay', schema: BlockDaySchema }])],
  providers: [BlockDayService],
  controllers: [BlockDayController],
})
export class BlockDayModule {}
