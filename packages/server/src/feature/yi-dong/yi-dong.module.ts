import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { YiDongSchema } from '@awamstock/model'
import { YiDongService } from './yi-dong.service'
import { YiDongController } from './yi-dong.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'YiDong', schema: YiDongSchema }])],
  providers: [YiDongService],
  controllers: [YiDongController],
})
export class YiDongModule {}
