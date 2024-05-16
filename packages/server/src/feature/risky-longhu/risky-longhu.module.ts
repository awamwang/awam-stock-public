import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { RiskyLonghuSchema } from '@awamstock/model'
import { RiskyLonghuService } from './risky-longhu.service'
import { RiskyLonghuController } from './risky-longhu.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'RiskyLonghu', schema: RiskyLonghuSchema }])],
  providers: [RiskyLonghuService],
  controllers: [RiskyLonghuController],
  exports: [RiskyLonghuService],
})
export class RiskyLonghuModule {}
