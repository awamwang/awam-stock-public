import dayjs from 'dayjs'

import { mapObj, DATE_FORMAT, timer, _, parseStrNumber } from '@awamstock/shared'
import { EAST_MONEY_TOKEN as USER_TOKEN } from '@awamstock/shared/config'
import { IEnvironment, Environment, environmentMap } from '@awamstock/model'
import { DataWorker } from '../worker'
import { myFetch, baseUrl, headers } from '../../lib/api-fetch/index'
// import { handleWorkerError } from '../exception'

// const fields1Map = {
//   f1: 's2nDate',
//   f2: 'n2s',
//   f3: 's2nDate',
//   f4: 'n2s',
// }
// const fields1NameMap = _.invert(fields1Map)
// const fields2Map = {
//   f51: 'time',
//   f52: 'date',
//   f53: 'zt',
//   f54: '成交净买额',
// }
// 北向净流入
export async function getTimeNorthFund(params: { time?: number; limit?: number } = {}) {
  const { time = dayjs().unix() * 1000, limit = 1 } = params
  const res = await myFetch(`${baseUrl.eastmoney}/qt/kamt.rtmin/get?fields1=f1,f3&fields2=f51,f52,f54,f56&ut=${USER_TOKEN}&lmt=${limit}&_=${time}`)

  return res
}
// const fields2Map = {
//   f51: 'time',
//   f52: 'date',
//   f53: 'zt',
//   f54: '沪股通净买',
//   f58: '深股通净买',
//   f62: '北向净买',
// }
// 北向净买入
export async function getTimeNorthBuy(params: { time?: number; limit?: number } = {}) {
  const { time = dayjs().unix() * 1000, limit = 1 } = params
  const res: any = await myFetch(`${baseUrl.eastmoney}/qt/kamtbs.rtmin/get?fields1=f1,f3&fields2=f51,f54,f58,f62&ut=${USER_TOKEN}&lmt=${limit}&_=${time}`)
  const latestData = _.last(_.filter(res.data.s2n, (v) => v.split(',')[1] !== '-'))
  const [, net_hk2sh, net_hk2sz, net_s2n] = (latestData as string).split(',')

  return {
    net_hk2sh: parseStrNumber(net_hk2sh, '万'),
    net_hk2sz: parseStrNumber(net_hk2sz, '万'),
    net_s2n: parseStrNumber(net_s2n, '万'),
  }
}

export async function getDayNorthFund(params: { time?: number; limit?: number } = {}) {
  const { time = dayjs().unix() * 1000, limit = 1 } = params
  const res = await myFetch(`${baseUrl.eastmoney}/qt/kamt.kline/get?fields1=f1,f3,f5&fields2=f51,f52&klt=101&lmt=${limit}&ut=${USER_TOKEN}&_=${time}`)

  return res
}

function parseNorthFundValue(list: string[]) {
  if (!list) return 0

  return parseStrNumber(list[0].split(',')[1], '万')
}

export async function getNorthFund(): Promise<Partial<IEnvironment>> {
  const res = await getTimeNorthFund({ limit: 1 })

  return {
    s2n: parseNorthFundValue(res.data?.s2n),
    hk2sz: parseNorthFundValue(res.data?.hk2sz),
    hk2sh: parseNorthFundValue(res.data?.hk2sh),
  }
}

export async function getTodayNorthFund(): Promise<Partial<IEnvironment>> {
  const res = await getDayNorthFund({ limit: 1 })

  return {
    s2n: parseNorthFundValue(res.data?.s2n),
    hk2sz: parseNorthFundValue(res.data?.hk2sz),
    hk2sh: parseNorthFundValue(res.data?.hk2sh),
  }
}

// 主力净额
export async function getMainFund(params: { time?: number; limit?: number } = {}): Promise<Partial<IEnvironment>> {
  const { time = dayjs().unix() * 1000, limit = 1 } = params
  const res = await myFetch(
    `${baseUrl.eastmoney}/qt/stock/fflow/kline/get?klt=1&fields1=f1,f2,f3,f7&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63,f64,f65&secid=1.000001&secid2=0.399001&lmt=${limit}&_=${time}`
  )
  const list = res.data?.klines[0].split(',')

  return {
    m_net: list[1],
    net_small: list[2],
    net_middle: list[3],
    net_big: list[4],
    net_super: list[5],
  }
}

// LongTouBlockWorker
export class 北向资金 extends DataWorker<IEnvironment> {
  protected model = Environment
  protected upsert = true

  async get() {
    const res = await getTimeNorthBuy()

    return res as IEnvironment
  }

  async afterWork() {
    console.log('[worker] 更新北向资金完成')
  }
}

// new 北向资金().work()
