import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { StockPoolSchema } from '@awamstock/model'
import { StockPoolService } from './stock-pool.service'
import { StockPoolController } from './stock-pool.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'StockPool', schema: StockPoolSchema }])],
  providers: [StockPoolService],
  controllers: [StockPoolController],
})
export class StockPoolModule {}
