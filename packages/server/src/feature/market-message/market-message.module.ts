import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MarketMessageSchema } from '@awamstock/model'
import { MarketMessageService } from './market-message.service'
import { MarketMessageController } from './market-message.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'MarketMessage', schema: MarketMessageSchema }])],
  providers: [MarketMessageService],
  controllers: [MarketMessageController],
})
export class MarketMessageModule {}
