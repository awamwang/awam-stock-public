import { dayjs, DATE_FORMAT, calendarBetween } from '@awamstock/shared'
import { ITradeCalendar } from '@awamstock/model'
import { myFetch, baseUrl } from '../../../lib/api-fetch/index'

export interface AkshareTradeCalendarItem {
  trade_date: string
}

export async function getTradeDateList(params: { start?: string; end?: string; format?: string } = {}): Promise<string[]> {
  const { start, end, format = DATE_FORMAT } = params

  const tradeDateCalendar = await myFetch(`${baseUrl.aktools}/api/public/tool_trade_date_hist_sina`)
  let list = tradeDateCalendar.map((item: AkshareTradeCalendarItem) => dayjs(item.trade_date, format))

  if (start && dayjs(start).isAfter(list[0])) {
    list = list.filter((item) => item.isAfter(start))
  }
  if (end && dayjs(end).isBefore(list[list.length - 1])) {
    list = list.filter((item) => item.isBefore(end))
  }

  return list.map((item) => item.format(format))
}

export async function getTradeCalendarData(params: { start?: string; end?: string; format?: string } = {}): Promise<ITradeCalendar[]> {
  const format = params.format || DATE_FORMAT
  const tradeDateList = await getTradeDateList(params)
  const calendar = calendarBetween(params.start || tradeDateList[0], params.end || tradeDateList[tradeDateList.length - 1], format)

  return calendar.map((date) => ({
    date,
    exchange: 'SSE',
    open: tradeDateList.includes(date) ? 1 : 0,
    pre_date: dayjs(date).subtract(1, 'day').format(format),
  }))
}

// ;(async function () {
//   const cal = await getTradeCalendarData({
//     start: '20230101',
//     end: '20231231',
//   })
//   console.log(cal)
// })()
