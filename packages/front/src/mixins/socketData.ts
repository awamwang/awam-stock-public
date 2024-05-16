import { Vue } from 'vue-class-component'
import { Socket as SocketClass } from 'socket.io-client'

import { ITypeSocketData } from '@awamstock/model'
import { SOCKET_EVENTS } from '@awamstock/shared/global'

@VueOptions({})
export default class SocketDataMixin extends Vue {
  global = useGlobalStore()
  block = useBlockStore()
  environment = useEnvironmentStore()
  dingPan = useDingPanStore()
  stockPool = useStockPoolStore()

  @Socket(SOCKET_EVENTS.serverData)
  async onSeverData(data: ITypeSocketData) {
    switch (data.name) {
      case 'lastTradeDate':
        return this.environment.setLastTradeDateData(data)
      case '大盘':
        return this.environment.setEnviroment(data)
      case '全球市场':
        return this.environment.setGlobalMarket(data)
      case '板块涨跌':
        return this.block.setBlockDays(data)
      case '短线精灵':
        return this.dingPan.updateRadars(data)
      case '大盘异动':
        return this.dingPan.updateYiDongs(data)
      case '市场消息':
        return this.dingPan.updateMarketMessages(data)
      case '板块人气':
        return this.dingPan.setMoodBlocks(data)
      case '板块人气个股':
        return this.dingPan.updateMoodBlockStocks(data)
      case '个股人气':
        return this.dingPan.setMoodStocks(data)
      case '竞价个股异动':
        return this.dingPan.setBeforeOpenStocks(data)
      case '股票池':
        return this.stockPool.setStockPool(data)
      default:
        console.log(data)
    }
  }

  getSocketStatus(io: SocketClass) {
    return io.connected ? '正常' : '断开'
  }
}
