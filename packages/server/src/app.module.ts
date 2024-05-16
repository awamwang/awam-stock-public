import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { db } from '@awamstock/shared'

// import { LoggerMiddleware } from './middleware/logger'

import { HelperModule } from './provider/helper.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GatewayModule } from './gateway/module'
import { ReactiveModule } from './reactive/reactive.module'
// import { CatsModule } from './cats/cats.module'

import { FeatureModule } from './feature.module'
import { GlobalConfigModule } from './feature/global-config/global-config.module'
import { TradeCalendarModule } from './feature/trade-calendar/trade-calendar.module'
import { StockModule } from './feature/stock/stock.module'
import { BlockModule } from './feature/block/block.module'
import { SafeScoreModule } from './feature/safe-score/safe-score.module'
import { BlockDayModule } from './feature/block-day/block-day.module'
import { MoodBlockItemModule } from './feature/mood-block-item/mood-block-item.module'
import { MoodStockItemModule } from './feature/mood-stock-item/mood-stock-item.module'
import { EnvironmentModule } from './feature/environment/environment.module'
import { GlobalMarketModule } from './feature/global-market/global-market.module'
import { BeforeOpenStockModule } from './feature/before-open-stock/before-open-stock.module'
import { StockPoolModule } from './feature/stock-pool/stock-pool.module'
import { YiDongModule } from './feature/yi-dong/yi-dong.module'
import { MarketMessageModule } from './feature/market-message/market-message.module'
import { RadarModule } from './feature/radar/radar.module'
import { DepartmentTradeModule } from './feature/department-trade/department-trade.module'
import { FocusedDepartmentModule } from './feature/focused-department/focused-department.module'
import { RiskyLonghuModule } from './feature/risky-longhu/risky-longhu.module'
import { FlowModule } from './feature/flow/flow.module'
import { MoodBlockStockModule } from './feature/mood-block-stock/mood-block-stock.module'

import { CommonSubscribeService, GlobalSubscribeService, RecordSubscribeService, BeforeOpenStockSubscribeService } from './reactive/subscribe.module'

import { WorkerModule } from './worker/worker.module'

const FeatureModules = [
  GlobalConfigModule,
  TradeCalendarModule,
  StockModule,
  BlockModule,
  BeforeOpenStockModule,
  BlockDayModule,
  EnvironmentModule,
  GlobalMarketModule,
  MarketMessageModule,
  MoodBlockItemModule,
  MoodStockItemModule,
  MoodBlockStockModule,
  RadarModule,
  SafeScoreModule,
  StockPoolModule,
  YiDongModule,
  DepartmentTradeModule,
  FocusedDepartmentModule,
  RiskyLonghuModule,
  FlowModule,
]

const SubscribeServices = [CommonSubscribeService, GlobalSubscribeService, RecordSubscribeService, BeforeOpenStockSubscribeService]

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(db.url),
    HelperModule,
    ReactiveModule,
    GatewayModule,
    WorkerModule,
    ...FeatureModules,
    // RouterModule.register([
    //   {
    //     path: 'api/v1',
    //     module: FeatureModule,
    //   },
    // ]),
  ],
  controllers: [AppController],
  providers: [AppService, ...SubscribeServices],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes({ path: 'cats', method: RequestMethod.ALL })
  }
}
