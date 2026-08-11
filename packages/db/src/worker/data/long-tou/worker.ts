import dayjs from 'dayjs'

import { mapObj, DATE_FORMAT, timer, _, ensureArray } from '@awamstock/shared'
import {
  IBlock,
  Block,
  IBlockDay,
  BlockDay,
  blockDayMap,
  IEnvironment,
  Environment,
  environmentMap,
  IGlobalMarket,
  GlobalMarket,
  globalMarketMap,
  IRadar,
  Radar,
  radarMap,
  IBeforeOpenStock,
  BeforeOpenStock,
  IMoodBlockItem,
  MoodBlockItem,
  moodBlockItemMap,
  IMoodStockItem,
  MoodStockItem,
  moodStockItemMap,
  IMoodBlockStock,
  MoodBlockStock,
  moodBlockStockMap,
} from '@awamstock/model'
import { API_V, API_V_HQ, USER_ID, TOKEN, LongTouHqUrl, LongTouHisUrl, longTouPost, zhiShuStockListUrl } from './util'
import { DataWorker } from '../../worker'
import { myFetch, baseUrl } from '../../../lib/api-fetch/index'
import { getTimeNorthBuy, getTodayNorthFund, getMainFund } from './../eastmoney'
import { fetchLimitUpPool, mapThsItemToStockPool } from './../ths-limit-up'
// import { handleWorkerError } from '../exception'

// Day=2022-05-30&

async function getBlock(params: { code: string; limit?: number }): Promise<IBlock> {
  const { limit = 300 } = params
  const res = await myFetch(zhiShuStockListUrl({ code: params.code, limit }))

  return {
    code: params.code,
    name: '',
    stockCount: (res.Stocks as string[]).length,
    codeList: res.Stocks as string[],
    from: 'long-tou',
    type: 'gn',
  } as IBlock
}

async function getBlockStocks(params: { code: string; limit?: number }): Promise<IMoodBlockStock[]> {
  const { limit = 10 } = params
  const res = await myFetch(zhiShuStockListUrl({ code: params.code, limit }))

  return ensureArray(res.list).map(
    (item: any) =>
      ({
        ...mapObj(item, moodBlockStockMap, { saveExtra: true }),
        date: timer.today(),
        createdAt: new Date(),
      } as IMoodBlockStock)
  )
}

// LongTouBlockWorker
export class LongTouBlockWorker extends DataWorker<IBlock> {
  protected model = Block
  protected upsert = true
  protected useBulkSave = ['date', 'type', 'alias'] as Array<keyof IBlock>

  async get() {
    const res = await myFetch(`${baseUrl.LongTou}?Order=1&a=PlateAnalysis&st=300&c=HomeDingPan&PhoneOSNew=1&Index=0&PidType=0&apiv=${API_V}&Type=2&`)

    return await Promise.all(
      ensureArray(res.list).map(async (item: any) => ({ ...(await getBlock({ code: item[0] })), code: item[0], name: item[1], date: timer.today(), createdAt: new Date() }))
    )
  }

  async afterWork() {
    console.log('[worker] 更新LonTou板块完成')
  }
}

export class 板块涨跌 extends DataWorker<IBlockDay> {
  protected model = BlockDay
  protected upsert = true

  // code,dt,zt
  protected emitFields: Array<keyof IBlockDay> = ['date', 'code', 'zt', 'dt']

  async get() {
    const res = await myFetch(`${baseUrl.LongTou}?Order=1&a=PlateAnalysis&st=300&c=HomeDingPan&PhoneOSNew=1&Index=0&PidType=0&apiv=${API_V}&Type=2&`)

    return ensureArray(res.list).map(
      (item: any) =>
        ({
          ...mapObj(item, blockDayMap, { saveExtra: false }),
          date: timer.today(),
          createdAt: new Date(),
        } as IBlockDay)
    )
  }
}

// 统计
// {{LongTouurl}}?a=ZhangFuDetail&apiv=${API_V}&c=HomeDingPan&PhoneOSNew=1&
export class 大盘 extends DataWorker<IEnvironment> {
  protected needArchive = true
  protected model = Environment

  async get() {
    const [res, net_north, north, main] = await Promise.all([
      myFetch(`${baseUrl.LongTou}?a=ZhangFuDetail&apiv=${API_V}&c=HomeDingPan&PhoneOSNew=1&`),
      getTimeNorthBuy(),
      getTodayNorthFund(),
      getMainFund(),
    ])

    return {
      date: timer.today(),
      ...mapObj(res.info, environmentMap, { saveExtra: false }),
      ...net_north,
      ...north,
      ...main,
    } as IEnvironment
  }
}

// const config: IWorkerConfig = {
//   freq: 'day',
//   timeLimit: '>9:30:00,<15:01:00',
// }

// 个股人气
// {{LongTouurl}}?Order=1&a=GetHotPHB&st=30&apiv=${API_V}&Type=1&c=StockBidYiDong&PhoneOSNew=1&&Index=0&
export class 个股人气 extends DataWorker<IMoodStockItem> {
  protected model = MoodStockItem
  protected upsert = true

  // code,name,r,sort
  protected emitFields: Array<keyof IMoodStockItem> = ['code', 'name', 'r', 'sort', 'change']

  async get() {
    const res = await myFetch(`${baseUrl.LongTou}?Order=1&a=GetHotPHB&st=30&apiv=${API_V}&Type=1&c=StockBidYiDong&PhoneOSNew=1&&Index=0&`)

    return ensureArray(res.List).map((item: any) => ({
      ...mapObj<IMoodStockItem>(item, moodStockItemMap, { saveExtra: true }),
      time: Number(res.Time),
      date: timer.today(),
    }))
  }
}
// export class 个股人气 extends DataWorker<IMoodStock> {
//   protected model = MoodStock
//   protected needArchive = true

//   async get() {
//     const data: {
//       List: any[]
//       Time: number
//     } = await myFetch(`${baseUrl.LongTou}?Order=1&a=GetHotPHB&st=30&apiv=${API_V}&Type=1&c=StockBidYiDong&PhoneOSNew=1&&Index=0&`)

//     return {
//       list: data.List.map((item: any) => mapObj(item, moodStockItemMap, { saveExtra: true })) as IMoodStockItem[],
//       time: Number(data.Time),
//       date: timer.today(),
//       createdAt: new Date(),
//     }
//   }
// }

export class 板块人气 extends DataWorker<IMoodBlockItem> {
  protected model = MoodBlockItem
  protected upsert = true

  // code,name,power,r,rs,m_net,time
  protected emitFields: Array<keyof IMoodBlockItem> = ['date', 'code', 'name', 'power', 'r', 'rs', 'm_net', 'time']

  async get() {
    const limit = 10

    const res = await myFetch(`${baseUrl.LongTou}?Order=1&a=RealRankingInfo&st=${limit}&apiv=${API_V}&Type=1&c=ZhiShuRanking&PhoneOSNew=1&Index=0&ZSType=7&`)

    return ensureArray(res.list).map((item: any) => ({
      ...mapObj<IMoodBlockItem>(item, moodBlockItemMap, { saveExtra: true }),
      time: Number(res.Time),
      date: timer.today(),
    }))
  }
}
// export class 板块人气 extends DataWorker<IMoodBlock> {
//   protected model = MoodBlock
//   protected needArchive = true

//   async get() {
//     const limit = 10

//     const data: {
//       list: any[]
//       Time: number
//     } = await myFetch(`${baseUrl.LongTou}?Order=1&a=RealRankingInfo&st=${limit}&apiv=${API_V}&Type=1&c=ZhiShuRanking&PhoneOSNew=1&Index=0&ZSType=7&`)

//     return {
//       list: data.list.map((item: any) => mapObj(item, moodBlockItemMap, { saveExtra: true })) as IMoodBlockItem[],
//       time: data.Time,
//       date: timer.today(),
//       createdAt: new Date(),
//     }
//   }
// }
export class 板块人气个股 extends DataWorker<IMoodBlockStock> {
  protected model = MoodBlockStock
  protected upsert = true

  protected emitFields: Array<keyof IMoodBlockStock> = ['code', 'name', 'blocks', 'r', 'p', 'money_type', 'm', 'm_net', 'lb', 'pos', 'hs', 'time']

  async get() {
    const limit = 10

    const res = await myFetch(`${baseUrl.LongTou}?Order=1&a=RealRankingInfo&st=${limit}&apiv=${API_V}&Type=1&c=ZhiShuRanking&PhoneOSNew=1&Index=0&ZSType=7&`)
    const blocks = await Promise.all(
      ensureArray(res.list).map(async (item: any) => ({
        code: item[0],
        stocks: await getBlockStocks({ code: item[0] }),
      }))
    )

    return _.unionBy(blocks, 'code').reduce(
      (acc: any[], block) => [
        ...acc,
        ...block.stocks.map((stock: any) => ({
          ...mapObj(stock, moodBlockStockMap, { saveExtra: true }),
          block_code: block.code,
          date: timer.today(),
          time: Number(res.Time),
        })),
      ],
      []
    )
  }
}

// 短线精灵
// {{LongTouurl}}?a=Radar&st=100&apiv=${API_V}&c=HomeDingPan&PhoneOSNew=1&Index=0&
export class 短线精灵 extends DataWorker<IRadar> {
  protected model = Radar

  // code,name,type,content,lb,time
  protected emitFields: Array<keyof IRadar> = ['code', 'name', 'type', 'content', 'lb', 'time']

  async get(params: Record<string, any> = {}) {
    const { limit = 100 } = params

    const res = await myFetch(`${baseUrl.LongTou}?a=Radar&st=${limit}&apiv=${API_V}&c=HomeDingPan&PhoneOSNew=1&Index=0&`)

    return ensureArray(res.list).map(
      (item: any) =>
        ({
          ...mapObj(item, radarMap),
          date: timer.today(),
          createdAt: new Date(),
        } as IRadar)
    )
  }
}

// 全球市场
// {{LongTouurl}}?a=GlobalCommon&apiv=w26&c=GlobalIndex&PhoneOSNew=1&UserID=0&Token=0&View=1%2C2%2C3%2C4%2C5%2C6&

export class 全球市场 extends DataWorker<IGlobalMarket> {
  protected model = GlobalMarket
  protected needArchive = true

  // code,name,increase_rate
  protected emitFields: Array<keyof IGlobalMarket> = ['code', 'name', 'increase_rate']

  async get() {
    const data: any = await myFetch(`${baseUrl.LongTou}?a=GlobalCommon&apiv=w26&c=GlobalIndex&PhoneOSNew=1&UserID=0&Token=0&View=1%2C2%2C3%2C4%2C5%2C6&`)

    const list = data.CYWWZS.filter(() => 1) // 全部指数
      .concat(data.RMGZ.filter((e: IGlobalMarket) => ['CN0Y'].includes(e.code))) // A50-CN0Y
      .concat(data.WWYD.filter(() => 0)) // 不要公司指数
      .concat(data.RMGP.filter(() => 0)) // 不要公司指数
      .concat(data.QQSP.filter((e: IGlobalMarket) => ['BRN0Y'].includes(e.code))) // 期货要(原油-BRN0Y)
      .concat(data.HLZS.filter((e: IGlobalMarket) => ['USDIND', 'USDCNH'].includes(e.code))) // 美元要(美元指数-USDIND, 美元离岸人民币)

    return list.map((e: any) => ({
      ...mapObj(e, globalMarketMap),
      date: dayjs().format(DATE_FORMAT),
      createdAt: new Date(),
    }))
  }
}

// 大盘直播
// {{LongTouurl}}?st=10&a=ZhiBoContent&apiv=w24&c=ConceptionPoint&PhoneOSNew=1&index=0&
export async function 大盘直播() {
  return await myFetch(`${baseUrl.LongTou}?st=10&a=ZhiBoContent&apiv=w24&c=ConceptionPoint&PhoneOSNew=1&index=0&`).then((data) => {
    throw new Error('未完成')
  })
}

// 今日涨停（同花顺 limit_up_pool；开盘啦 DaBanList 已失效）
export async function 今日涨停(params: Record<string, any> = {}) {
  const date = (params.date as string) || timer.today()
  const res = await fetchLimitUpPool({ date, limit: Number(params.limit) || 200 })
  return ensureArray(res.data?.info).map((item) => mapThsItemToStockPool(item, date))
}

// 个股L2
// {{LongTouurl}}?a=GetZhangTingGene&apiv=w26&c=StockL2Data&StockID=600602&PhoneOSNew=1&
export async function 个股L2(id: string) {
  return await myFetch(`${baseUrl.LongTou}?a=GetZhangTingGene&apiv=w26&c=StockL2Data&StockID=${id}&PhoneOSNew=1&`).then((data) => {
    throw new Error('未完成')
  })
}

// 席位龙虎榜
// {{LongTouurl}}?a=GetYTFP_LHBDX&c=FuPanLa&PhoneOSNew=1&apiv=${API_V}&
export async function 席位龙虎榜() {
  return await myFetch(`${baseUrl.LongTou}?a=GetYTFP_LHBDX&c=FuPanLa&PhoneOSNew=1&apiv=${API_V}&`).then((data) => {
    throw new Error('未完成')
  })
}

// 涨停信息
// 主源 ZhangTingExpression 盘后常返回 list 占位；ChangeStatistics 偶发空 body。
// 回退顺序：有效 info → ChangeStatistics.change → MoodNumCount（家数摘要）
export class 涨停信息 extends DataWorker {
  protected needArchive = true

  constructor() {
    super()
    this.collectionId = 'ztView'
  }

  async get() {
    const [expressionRes, changeRes, moodRes] = await Promise.all([
      myFetch(`${baseUrl.LongTou}?a=ZhangTingExpression&apiv=${API_V}&c=HomeDingPan&PhoneOSNew=1&`).catch((err) => {
        console.warn('[worker] 涨停信息：ZhangTingExpression 请求失败', err)
        return null
      }),
      myFetch(`${LongTouHisUrl}?Index=0&PhoneOSNew=2&VerSion=5.13.0.7&a=ChangeStatistics&apiv=w35&c=HomeDingPan&st=1000`).catch((err) => {
        console.warn('[worker] 涨停信息：ChangeStatistics 请求失败', err)
        return null
      }),
      longTouPost(LongTouHqUrl, {
        a: 'MoodNumCount',
        c: 'MarketMood',
        apiv: 'w35',
        PhoneOSNew: 2,
        VerSion: '5.13.0.7',
      }).catch((err) => {
        console.warn('[worker] 涨停信息：MoodNumCount 请求失败', err)
        return null
      }),
    ])

    const info = Array.isArray(expressionRes?.info) ? expressionRes.info : null
    // 非交易时段接口可能返回 ["kaipanla.com", ...] 占位 list，避免写入无效数据
    const validInfo = info && info.length >= 12 && typeof info[0] === 'number' ? info : null
    if (!validInfo) {
      console.warn('[worker] 涨停信息：ZhangTingExpression 无有效 info', {
        errcode: expressionRes?.errcode,
        keys: expressionRes ? Object.keys(expressionRes) : [],
      })
    }

    const today = timer.today()
    const todayDash = `${today.slice(0, 4)}-${today.slice(4, 6)}-${today.slice(6, 8)}`
    const changeList = ensureArray(changeRes?.info)
    const changeToday =
      changeList.find((item: any) => {
        const day = String(item?.Day || '')
        return day === today || day === todayDash
      }) || changeList[0]

    let change =
      changeToday != null
        ? {
            source: 'ChangeStatistics',
            ztjs: Number(changeToday.ztjs) || 0,
            df_num: Number(changeToday.df_num) || 0,
            strong: Number(changeToday.strong) || 0,
            lbgd: Number(changeToday.lbgd) || 0,
            tip: typeof changeRes?.tip === 'string' ? changeRes.tip : '',
            day: String(changeToday.Day || todayDash),
          }
        : null

    // ChangeStatistics 盘后常返回空 body；用 MoodNumCount 家数摘要兜底
    const mood = moodRes?.list && typeof moodRes.list === 'object' ? moodRes.list : null
    if (!change && mood) {
      change = {
        source: 'MoodNumCount',
        ztjs: Number(mood.ZTJS) || 0,
        df_num: Number(mood.DTJS) || 0,
        strong: 0,
        lbgd: 0,
        tip: '',
        day: todayDash,
        SZJS: Number(mood.SZJS) || 0,
        XDJS: Number(mood.XDJS) || 0,
        qscln: Number(mood.qscln) || 0,
        bl: Number(mood.bl) || 0,
        color: Number(mood.color) || 0,
      }
    }

    if (!validInfo && !change) {
      console.warn('[worker] 涨停信息：无可用数据（Expression/ChangeStatistics/MoodNumCount 均无效）')
      return null as any
    }

    return {
      info: validInfo,
      change,
      date: today,
      createdAt: new Date(),
    }
  }
}
export function 涨停信息_parser(data: any) {
  const [lb1, lb2, lb3, lbGd, jjl2, jjl3, jjlGd, 炸板率, 涨停溢价, 连板溢价, 昨日破板今表现, 操作建议] = data.info || []

  return {
    lb1,
    lb2,
    lb3,
    lbGd,
    jjl2,
    jjl3,
    jjlGd,
    炸板率,
    涨停溢价,
    连板溢价,
    昨日破板今表现,
    操作建议,
    change: data.change || null,
  }
}

function parseBiddingLb(label: unknown): number {
  const text = String(label || '')
  const matched = text.match(/(\d+)\s*连板/)
  if (matched) return Number(matched[1]) || 0
  if (text.includes('首板')) return 1
  return 0
}

function isValidStockCode(code: unknown): code is string {
  return typeof code === 'string' && /^\d{6}$/.test(code) && !code.includes('kaipanla')
}

/** MorningBiddingList 行 → IBeforeOpenStock（字段下标见 longhuvip-morning-bidding.md） */
function mapMorningBiddingRow(item: any[]): IBeforeOpenStock {
  const blockNames = String(item[11] || '')
  const gn = blockNames.split(/[、,，]/).map((s) => s.trim()).filter(Boolean)[0] || ''
  const lbTarget = String(item[16] || '')

  return {
    code: String(item[0]),
    name: String(item[1] || ''),
    type: 0,
    money_type: '',
    r_max: Number(item[3]) || 0,
    zt_to_buy: 0,
    m: Number(item[4]) || 0,
    lb_target: lbTarget,
    lb: parseBiddingLb(lbTarget),
    block_names: blockNames,
    lt: Number(item[12]) || 0,
    gn,
    r: Number(item[5]) || 0,
    m_net: Number(item[6]) || 0,
    hs: Number(item[7]) || 0,
  } as IBeforeOpenStock
}

// 竞价异动（MorningBiddingList 替代已失效的 DaBanList Type=18）
export class 竞价个股异动 extends DataWorker<IBeforeOpenStock> {
  protected model = BeforeOpenStock

  protected async afterWork() {
    // 空列表时不推送，避免覆盖前端已有竞价数据
    if (!this.data) return
    return super.afterWork()
  }

  async get() {
    const res: any = await longTouPost(LongTouHqUrl, {
      Order: 1,
      st: 200,
      a: 'MorningBiddingList',
      c: 'HomeDingPan',
      PhoneOSNew: 1,
      VerSion: '5.19.0.0',
      Token: TOKEN || '0',
      Index: 0,
      PidType: 0,
      apiv: API_V_HQ,
      Type: 4,
      UserID: USER_ID || '0',
    })

    const errcode = res?.errcode != null ? String(res.errcode) : ''
    const status = Number(res?.status)
    const rows = ensureArray(res?.info).filter((item: any) => Array.isArray(item) && isValidStockCode(item[0]))

    // 空列表 / status!=1 时勿覆盖库内已有竞价数据
    if (errcode !== '0' || status !== 1 || rows.length === 0) {
      console.warn('[worker] 竞价个股异动：无有效列表，跳过写入', {
        errcode: res?.errcode,
        status: res?.status,
        count: rows.length,
      })
      return null as any
    }

    return rows.map(
      (item: any) =>
        ({
          ...mapMorningBiddingRow(item),
          date: timer.today(),
          createdAt: new Date(),
        } as IBeforeOpenStock)
    )
  }
}

// 盘面关注
// {{LongTouurl}}?a=GetPMSL_PMLD&st=30&apiv=${API_V}&c=FuPanLa&PhoneOSNew=1&Index=0&
export async function 盘面关注() {
  return await myFetch(`${baseUrl.LongTou}?a=GetPMSL_PMLD&st=30&apiv=${API_V}&c=FuPanLa&PhoneOSNew=1&Index=0&`).then((data) => {
    throw new Error('未完成')
  })
}

// GroupStock（股票新高分组）
// {{LongTouurl}}?a=GroupStock&st=10&apiv=${API_V}&Type=0_0_0_0_0&c=StockNewHigh&PhoneOSNew=1&Index=0&
export async function GroupStock() {
  return await myFetch(`${baseUrl.LongTou}?a=GroupStock&st=10&apiv=${API_V}&Type=0_0_0_0_0&c=StockNewHigh&PhoneOSNew=1&Index=0&`)
}

// 板块异动（涨停原因板块）
// {{LongTouurl}}?a=GetPlateInfo_w38&st=10&apiv=${API_V}&c=DailyLimitResumption&PhoneOSNew=1&Index=0&
export async function 板块异动() {
  return await myFetch(`${baseUrl.LongTou}?a=GetPlateInfo_w38&st=10&apiv=${API_V}&c=DailyLimitResumption&PhoneOSNew=1&Index=0&`)
}

async function run() {
  await new 大盘().work().catch(console.error)
  // await 个股人气().catch(console.error)
  // await new 个股人气().work().catch(console.error)
  // await new 板块人气().work().catch(console.error)
  // await new 板块人气个股().work().catch(console.error)
  // await 涨停信息().catch(console.error)
  // await new 大盘().work().catch(console.error)
  // await new LongTouBlockWorker().work().catch(console.error)
  console.log('done')
}

// run().catch(console.error)
