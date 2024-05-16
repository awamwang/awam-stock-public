import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MoodBlockStockSchema, MarketMessageSchema, RadarSchema, YiDongSchema } from '@awamstock/model'

import { CommonObservableService } from './observable/common'
import { GlobalObservableService } from './observable/global'
import { MoodBlockStockObservableService } from './observable/mood-block-stock'
import { MarketMessageObservableService } from './observable/market-message'
import { RadarObservableService } from './observable/radar'
import { YiDongObservableService } from './observable/yi-dong'

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
  providers: [CommonObservableService, GlobalObservableService, MoodBlockStockObservableService, MarketMessageObservableService, RadarObservableService, YiDongObservableService],
  exports: [CommonObservableService, GlobalObservableService, MoodBlockStockObservableService, MarketMessageObservableService, RadarObservableService, YiDongObservableService],
})
export class ObservableModule {}

export { CommonObservableService, GlobalObservableService, MoodBlockStockObservableService, MarketMessageObservableService, RadarObservableService, YiDongObservableService }
