import { Injectable, Logger } from '@nestjs/common'
import { filter } from 'rxjs'
import { PlainDataModel, ITypeSocketData } from '@awamstock/model'
import { EnvironmentWorkerService } from '../../worker/worker.module'
import { MoodBlockStockObservableService, MarketMessageObservableService, RadarObservableService, YiDongObservableService, CommonObservableService } from '../observable.module'
import { SocketHelper } from '../../provider/socket.helper'

const DirectDataList = ['大盘', '板块涨跌', '全球市场', '板块人气', '个股人气', '股票池']

@Injectable()
export class CommonSubscribeService {
  private readonly logger = new Logger(CommonSubscribeService.name)

  constructor(
    private socketHelper: SocketHelper,
    private readonly commonOb: CommonObservableService,
    private readonly moodBlockStockOb: MoodBlockStockObservableService,
    private readonly marketMessageOb: MarketMessageObservableService,
    private readonly radarOb: RadarObservableService,
    private readonly yiDongOb: YiDongObservableService,
    private readonly environmentWorker: EnvironmentWorkerService
  ) {
    commonOb.ob.pipe(filter((v) => DirectDataList.includes(v.name))).subscribe((v) => {
      switch (v.name) {
        case '大盘':
          this.environmentWorker.work(v.data)
          break
      }

      this.socketHelper.sendFrontData<PlainDataModel>(v)
    })
    this.logger.log(`CommonSubscribeService inited`)
  }
}
