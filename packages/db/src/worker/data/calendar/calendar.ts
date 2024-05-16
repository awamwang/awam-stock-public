import dayjs from 'dayjs'

import { DATE_FORMAT, mapObj } from '@awamstock/shared'
import { GlobalConfig, TradeCalendar, tradeCalendarMap } from '@awamstock/model'
import { getTradeCalendarData } from './util'
import { ignoreDbError } from '../../../db/exception'
import { sendSocketData } from '../../../server/index'

const lastTradeDateRecord = {
  value: '',
  recordDate: '',
}
async function updateLastTradeDateRecord(date: string, today: string) {
  lastTradeDateRecord.value = date
  lastTradeDateRecord.recordDate = today

  await sendSocketData({ name: 'lastTradeDate', data: lastTradeDateRecord })
}

/**
 * 查询并保存最新交易日
 * @param format
 * @returns lastTradeDate
 */
export async function getLatestTradeDate(format = DATE_FORMAT): Promise<string> {
  const today = dayjs().format(format)

  // 内存中保存了最新查询，则直接返回内存的
  if (today === lastTradeDateRecord.recordDate) {
    return lastTradeDateRecord.value
  }

  // 查询数据库中最新的交易日
  const lastTradeDateConfig = (await GlobalConfig.findOne({ type: 'lastTradeDate' })) || {
    value: dayjs().format(format),
  }
  if (lastTradeDateConfig?.value !== today) {
    // 从TradeCalendar获取小于等于今日为open的记录
    const lastTradeDate = await TradeCalendar.findOne({ date: { $lte: today }, open: 1 }).sort({ date: -1 })
    if (lastTradeDate) {
      updateLastTradeDateRecord(lastTradeDate?.date, today)
      if (lastTradeDate?.date !== lastTradeDateConfig?.value) {
        await GlobalConfig.uniqueUpsert({ type: 'lastTradeDate', value: lastTradeDate?.date })
      }

      return lastTradeDate?.date || today
    }
  }

  return today
}

export async function getTradeCalendar(params: any = {}) {
  const list = (await getTradeCalendarData(params).catch(console.error)) || []
  const myList = list.map((o: any) => mapObj(o, tradeCalendarMap))

  await TradeCalendar.create(myList).catch(ignoreDbError)

  return myList
}

/**
 * 是否最新交易日
 * @param date 查询日期
 * @param format
 * @returns
 */
export async function isLastTradeDay(date?: string, format = DATE_FORMAT): Promise<boolean> {
  const today = dayjs(date).format(format)
  const lastTradeDate = await getLatestTradeDate(format)

  return today === lastTradeDate
}

export async function nTradeDayAgo(n: number): Promise<string> {
  const days = await TradeCalendar.find({ open: 1, date: { $lte: dayjs().format(DATE_FORMAT) } })
    .sort({ date: -1 })
    .limit(3)

  if (days.length < n) {
    throw new Error('无法获取n天前的交易日')
  }

  return days[n - 1].date
}

// stockBasicRunner()
// ;(async function () {
//   console.log(await getLatestTradeDate())
//   // console.log(await isLastTradeDay())
//   // console.log(await nTradeDayAgo(3))
// })()
