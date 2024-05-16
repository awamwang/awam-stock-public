import { mapObj, timer, symbolToCode, SocketDataType, ensureArray } from '@awamstock/shared'
import {
  IEnvironment,
  Environment,
  environmentMap,
  IMarketMessage,
  MarketMessage,
  marketMessageMap,
  IYiDong,
  YiDong,
  yiDongMap,
  IStockPool,
  StockPool,
  stockPoolMap,
  StockPoolType,
} from '@awamstock/model'
import { DataWorker } from '../worker'
import { myFetch, baseUrl, headers } from '../../lib/api-fetch/index'
// import { handleWorkerError } from '../exception'

const BaoerHeaders = headers.baoer

const API_PREFIX = 'api'

export async function getBaoerEnvironment() {
  const res = await myFetch(`${baseUrl.baoerFlash}/api/market_indicator/line?fields=market_temperature,limit_up_broken_count,limit_up_broken_ratio,yesterday_limit_up_avg_pcp`, {
    headers: BaoerHeaders,
  })

  return mapObj(res.data[res.data.length - 1], environmentMap, { saveExtra: false })
}

// 统计
// {{LongTouurl}}?a=ZhangFuDetail&apiv=${API_PREFIX}&c=HomeDingPan&PhoneOSNew=1&
export class 大盘 extends DataWorker<IEnvironment> {
  protected model = Environment

  async get() {
    const res = await myFetch(
      `${baseUrl.baoer}/${API_PREFIX}/market_indicator/line?fields=market_temperature,limit_up_broken_count,limit_up_broken_ratio,yesterday_limit_up_avg_pcp,rise_count,fall_count`,
      {
        headers: BaoerHeaders,
      }
    )

    return mapObj<IEnvironment>(
      {
        date: timer.today(),
        ...res.info,
      },
      environmentMap,
      { saveExtra: false }
    )
  }
}

export class 市场消息 extends DataWorker<IMarketMessage> {
  protected model = MarketMessage

  // id,title,summary,content,stocks,blocks,time
  protected emitFields: Array<keyof IMarketMessage> = ['id', 'title', 'summary', 'content', 'image', 'subj_ids', 'stocks', 'blocks', 'time', 'date', 'createdAt', 'updatedAt']

  async get(params: Record<string, any> = {}) {
    const { limit = 30 } = params

    const res = await myFetch(`${baseUrl.baoer}/${API_PREFIX}/pc/msgs?subjids=9,10,723,35,469,821&limit=${limit}`, {
      headers: BaoerHeaders,
    })

    return ensureArray(res.NewMsgs).map((item: any) => {
      const o = mapObj(item, marketMessageMap, { saveExtra: false })

      return {
        ...o,
        stocks: o.stocks && o.stocks.map((stock: any) => symbolToCode(stock.Symbol)),
        date: timer.today(),
        createdAt: new Date(),
      } as IMarketMessage
    })
  }
}

export class 大盘异动 extends DataWorker<IYiDong> {
  protected model = YiDong

  protected emitFields: Array<keyof IYiDong> = ['id', 'title', 'block', 'time']

  async get() {
    const res = await myFetch(`${baseUrl.baoer}/${API_PREFIX}/messages/todayDaPanYiDong?headmark=0`, {
      headers: BaoerHeaders,
    })

    return ensureArray(res.Messages).map((item) => {
      const o = mapObj(item, yiDongMap, { saveExtra: false })

      return {
        ...o,
        date: timer.today(),
        createdAt: new Date(),
      } as IYiDong
    })
  }
}

class 股票池 extends DataWorker<IStockPool> {
  protected socketDataName = '股票池' as SocketDataType
  protected model = StockPool
  protected upsert = true

  // code,name,type,first_limit_up,last_limit_up,limit_up_days,turnover_ratio,surge_reason
  protected emitFields: Array<keyof IStockPool> = [
    'code',
    'name',
    'type',
    'first_limit_up',
    'last_limit_up',
    'limit_up_days',
    'turnover_ratio',
    'surge_reason',
    'date',
    'createdAt',
    'updatedAt',
  ]

  async stockPoolGet(type: StockPoolType, name: string) {
    const res = await myFetch(`${baseUrl.baoerFlash}/${API_PREFIX}/pool/detail?pool_name=${name}`, {
      headers: BaoerHeaders,
    })
    await this.model.deleteMany({ date: timer.today(), type })

    return ensureArray(res.data).map((item: any) => {
      const o = mapObj(item, stockPoolMap)

      return {
        ...o,
        type,
        code: symbolToCode(o.code),
        date: timer.today(),
        createdAt: new Date(),
      } as IStockPool
    })
  }
}

export class 涨停池 extends 股票池 {
  async get() {
    return await this.stockPoolGet('zt', 'limit_up')
  }
}

export class 跌停池 extends 股票池 {
  async get() {
    return await this.stockPoolGet('dt', 'limit_down')
  }
}

export class 炸板池 extends 股票池 {
  async get() {
    return await this.stockPoolGet('zt_broken', 'limit_up_broken')
  }
}

export class 强势股池 extends 股票池 {
  async get() {
    return await this.stockPoolGet('hot', 'super_stock')
  }
}

export class 昨日涨停池 extends 股票池 {
  async get() {
    return await this.stockPoolGet('zt_zr', 'yesterday_limit_up')
  }
}

async function run() {
  await new 跌停池().work().catch(console.error)
  // await new 大盘异动().work().catch(console.error)
  // await new 市场消息().work().catch(console.error)
  // await new 大盘().work().catch(console.error)
}

// run()
