/**
 * 龙虎危险
 *
 * 净额大于0 and (比例达到一定程度 or 排名前3)
 */
import _ from 'lodash'
import dayjs from 'dayjs'

import { files as FILES, symbolToCode, stockToCsv, writeFile, DATE_FORMAT } from '@awamstock/shared'
import { IDepartmentTrade, IFocusedDepartment, RiskyLonghu } from '@awamstock/model'
import { BatchWorker } from '../worker'
import { beforeStart } from '../wrapper'
import { getLatestTradeDate } from '../data/calendar/calendar'
import { collection, ignoreDbError } from '../../db/index'
import { handleWorkerError } from '../exception'

async function getRiskyDepartment(): Promise<IFocusedDepartment[]> {
  const c = await collection('focusedDepartment')
  const data = await c.find({ type: { $in: ['砸盘', '超短', '弱势'] } })
  return data.toArray() as unknown as IFocusedDepartment[]
}

async function getRiskyDepartmentNameList() {
  const departments = await getRiskyDepartment()
  return _.uniqBy(departments, 'name').map((department) => department.name)
}

export function 三日龙虎榜(trade: IDepartmentTrade): boolean {
  return ['连续3个交易日内收盘价格涨幅较基准指数偏离值累计达到30%的证券'].includes(trade['reason'])
}

function ignoreTrade(trade: IDepartmentTrade) {
  if (三日龙虎榜(trade)) {
    return false
  }

  return true
}

const lastTradeDate = ''

async function getDepartmentsTrade(date: string = lastTradeDate): Promise<IDepartmentTrade[]> {
  date = date || (await getLatestTradeDate('YYYYMMDD'))

  const c = await collection('departmentTrade')

  return c
    .find({
      date: date,
    })
    .toArray() as unknown as IDepartmentTrade[]
}

function isRisky(trade: IDepartmentTrade): boolean {
  const { net, buy_rate, d_sort } = trade

  return net > 0 && (buy_rate > 1 || d_sort <= 3)
}

function isSameTrade(a: IDepartmentTrade, b: IDepartmentTrade): boolean {
  return a['department'] === b['department'] && a['code'] === b['code']
}

/**
 * 处理数据重复，数据被拆分的情况
 * @param trades 营业部交易数据
 * @returns
 */
function handleTrades(trades: IDepartmentTrade[]) {
  trades = trades.filter(ignoreTrade)

  const result: IDepartmentTrade[] = []
  let last = {} as IDepartmentTrade

  trades.forEach((trade) => {
    if (isSameTrade(trade, last)) {
      // 相同则合并
      last['net'] += trade['net']
      last['buy'] += trade['buy']
      last['sell'] += trade['sell']
      last['buy_rate'] += trade['buy_rate']
      last['d_sort'] = Math.min(trade['d_sort'], last['d_sort'])
    } else {
      result.push(trade)
    }
    last = trade
  })
  return result
}

async function saveToFile(stocks: any) {
  const data = stocks.map(stockToCsv).join('\n')
  await writeFile(FILES.riskyLonghu, data, 'gbk')
  // return save('\\\\AWAM-PC2\\Stock\\files\\ths\\龙虎危险.txt', data)
}

async function riskyDepartmentStock(date?: string) {
  const riskyDepartmentNameList = await getRiskyDepartmentNameList()
  const trades: IDepartmentTrade[] = handleTrades(await getDepartmentsTrade())

  const riskyTrades = trades.filter((d) => riskyDepartmentNameList.includes(d.department)).filter(isRisky)
  let stocks = riskyTrades.map((trade) => ({
    name: trade.name,
    code: symbolToCode(trade.code),
  }))
  stocks = _.uniqBy(stocks, 'name')
  const data = {
    list: stocks.map((stock) => stock.code),
    date: dayjs().format(DATE_FORMAT),
    createdAt: new Date(),
  }

  await RiskyLonghu.uniqueUpsert(data)

  await saveToFile(stocks)
}

async function run(date?: string) {
  await beforeStart()

  await riskyDepartmentStock(date).catch(handleWorkerError)
  console.log(`[worker] 保存龙虎危险完成${date ? '-' + date : ''}`)
}

export default class RiskyDepartmentStockWorker extends BatchWorker {
  async batch(params: Record<string, any>) {
    const { date } = params

    await riskyDepartmentStock(date).catch(handleWorkerError)
    console.log(`[worker] 保存龙虎危险完成${date ? '-' + date : ''}`)
  }
}
// run('20220602')
