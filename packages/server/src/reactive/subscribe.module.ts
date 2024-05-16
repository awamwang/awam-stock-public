import { Module } from '@nestjs/common'

import { ObservableModule } from './observable.module'
import { WorkerModule } from '../worker/worker.module'

import { GlobalSubscribeService } from './subscribe/global'
import { BeforeOpenStockSubscribeService } from './subscribe/before-open-stock'
import { RecordSubscribeService } from './subscribe/record'
import { CommonSubscribeService } from './subscribe/common'

@Module({
  imports: [ObservableModule, WorkerModule],
  providers: [GlobalSubscribeService, BeforeOpenStockSubscribeService, RecordSubscribeService, CommonSubscribeService],
  exports: [GlobalSubscribeService, BeforeOpenStockSubscribeService, RecordSubscribeService, CommonSubscribeService],
})
export class SubscribeModule {}

export { GlobalSubscribeService, BeforeOpenStockSubscribeService, RecordSubscribeService, CommonSubscribeService }
