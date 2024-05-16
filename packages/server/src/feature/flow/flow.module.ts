import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DepartmentTradeSchema } from '@awamstock/model'
import { FlowService } from './flow.service'
import { FlowController } from './flow.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'DepartmentTrade', schema: DepartmentTradeSchema }])],
  providers: [FlowService],
  controllers: [FlowController],
})
export class FlowModule {}
