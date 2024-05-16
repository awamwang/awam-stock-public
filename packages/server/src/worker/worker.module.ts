import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MoodBlockStockSchema, MarketMessageSchema, RadarSchema, YiDongSchema } from '@awamstock/model'
import { EnvironmentWorkerService } from './data/Environment'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MoodBlockStock', schema: MoodBlockStockSchema },
      { name: 'MarketMessage', schema: MarketMessageSchema },
      { name: 'Radar', schema: RadarSchema },
      { name: 'YiDong', schema: YiDongSchema },
    ]),
  ],
  providers: [EnvironmentWorkerService],
  exports: [EnvironmentWorkerService],
})
export class WorkerModule {}

export { EnvironmentWorkerService }
