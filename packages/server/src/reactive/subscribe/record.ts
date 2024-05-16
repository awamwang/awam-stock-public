import { Injectable, Logger } from '@nestjs/common'
import { BehaviorSubject } from 'rxjs'
import { PlainDataModel, IRadarSocketData, IYiDongSocketData, IMarketMessageSocketData, IMoodBlockSocketData } from '@awamstock/model'
import { MoodBlockStockObservableService, MarketMessageObservableService, RadarObservableService, YiDongObservableService, GlobalObservableService } from '../observable.module'
import { SocketHelper } from '../../provider/socket.helper'

@Injectable()
export class RecordSubscribeService {
  private readonly logger = new Logger(RecordSubscribeService.name)

  constructor(
    private readonly globalOb: GlobalObservableService,
    private readonly moodBlockStockOb: MoodBlockStockObservableService,
    private readonly marketMessageOb: MarketMessageObservableService,
    private readonly radarOb: RadarObservableService,
    private readonly yiDongOb: YiDongObservableService,
    private socketHelper: SocketHelper
  ) {
    const recordObs = [this.radarOb, this.yiDongOb, this.marketMessageOb, this.moodBlockStockOb]

    this.globalOb.lastTradeDate.subscribe(async (v) => {
      if (v) {
        recordObs.forEach((ob) => ob.init({ date: v }))
        this.logger.log('[data] 重置lastTradeDate, 初始化record', v)
      }
    })

    recordObs.forEach((ob) =>
      (ob.record as BehaviorSubject<IRadarSocketData | IYiDongSocketData | IMarketMessageSocketData | IMoodBlockSocketData>).subscribe((v) => {
        if (v.data.length) {
          this.socketHelper.sendFrontData<PlainDataModel>(v)
        }
      })
    )

    this.logger.log(`RecordSubscribeService inited`)
  }
}
