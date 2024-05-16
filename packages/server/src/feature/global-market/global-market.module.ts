import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { GlobalMarketSchema } from '@awamstock/model'
import { GlobalMarketService } from './global-market.service'
import { GlobalMarketController } from './global-market.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'GlobalMarket', schema: GlobalMarketSchema }])],
  providers: [GlobalMarketService],
  controllers: [GlobalMarketController],
})
export class GlobalMarketModule {}
