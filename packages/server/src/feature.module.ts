import { Module } from '@nestjs/common'

import { GlobalConfigModule } from './feature/global-config/global-config.module'
import { TradeCalendarModule } from './feature/trade-calendar/trade-calendar.module'
import { StockModule } from './feature/stock/stock.module'
import { BlockModule } from './feature/block/block.module'
import { BlockDayModule } from './feature/block-day/block-day.module'
import { MoodBlockItemModule } from './feature/mood-block-item/mood-block-item.module'
import { BeforeOpenStockModule } from './feature/before-open-stock/before-open-stock.module'
import { SafeScoreModule } from './feature/safe-score/safe-score.module'
import { DepartmentTradeModule } from './feature/department-trade/department-trade.module'
import { StockPoolModule } from './feature/stock-pool/stock-pool.module'
import { YiDongModule } from './feature/yi-dong/yi-dong.module'
import { MarketMessageModule } from './feature/market-message/market-message.module'
import { EnvironmentModule } from './feature/environment/environment.module'
import { GlobalMarketModule } from './feature/global-market/global-market.module'
import { RadarModule } from './feature/radar/radar.module'
import { RiskyLonghuModule } from './feature/risky-longhu/risky-longhu.module'
import { FocusedDepartmentModule } from './feature/focused-department/focused-department.module'
import { FlowModule } from './feature/flow/flow.module'

@Module({
  imports: [
    GlobalConfigModule,
    TradeCalendarModule,
    StockModule,
    BlockModule,
    BeforeOpenStockModule,
    BlockDayModule,
    DepartmentTradeModule,
    FocusedDepartmentModule,
    EnvironmentModule,
    GlobalMarketModule,
    MarketMessageModule,
    MoodBlockItemModule,
    RadarModule,
    RiskyLonghuModule,
    SafeScoreModule,
    StockPoolModule,
    YiDongModule,
    FlowModule,
  ],
})
export class FeatureModule {}
