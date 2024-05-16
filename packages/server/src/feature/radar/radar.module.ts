import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { RadarSchema } from '@awamstock/model'
import { RadarService } from './radar.service'
import { RadarController } from './radar.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Radar', schema: RadarSchema }])],
  providers: [RadarService],
  controllers: [RadarController],
})
export class RadarModule {}
