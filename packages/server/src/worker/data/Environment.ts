import { Injectable, Logger } from '@nestjs/common'
import { cnUnitMap, numberToCn } from '@awamstock/shared'
import { IEnvironment } from '@awamstock/model'
import { SocketHelper } from '../../provider/socket.helper'

const 北向流出通知 = -40 * cnUnitMap.亿
const 北向流入通知 = 40 * cnUnitMap.亿

@Injectable()
export class EnvironmentWorkerService {
  private readonly logger = new Logger(EnvironmentWorkerService.name)

  constructor(private socketHelper: SocketHelper) {}

  async work(data: IEnvironment) {
    if (!data) return

    if (data.net_s2n <= 北向流出通知) {
      this.socketHelper.sendFrontGlobalNotify(`北向净流出${numberToCn(data.net_s2n)}`)
    }
    if (data.net_s2n >= 北向流入通知) {
      this.socketHelper.sendFrontGlobalNotify(`北向净流入${numberToCn(data.net_s2n)}`)
    }
  }
}
