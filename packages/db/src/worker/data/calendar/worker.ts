import { timer } from '@awamstock/shared'
import { BatchWorker } from '../../worker'
import { handleWorkerError } from '../../exception'
import { getTradeCalendar, getLatestTradeDate } from './calendar'

export class TradeCalendarWorker extends BatchWorker {
  async batch(params: Record<string, any> = {}) {
    await getTradeCalendar(params).catch(handleWorkerError)
    console.log(`[worker] 更新交易日历完成, ${params.start}-${params.end}`)
  }
}

export class TradeCalendarNextYearUpdateWorker extends BatchWorker {
  async batch(params?: Record<string, any>) {
    const date = timer.today()
    if (date.slice(4) === '1230') {
      // 每年1230日运行
      const nextYear = String(Number(date.slice(0, -4)) + 1)
      await new TradeCalendarWorker().work({ start: nextYear + '0101', end: String(Number(nextYear) + 1) + '0101' })
    }
    // await new TradeCalendarWorker().work({ start: '20240101', end: '20250101' })
  }
}

export class LatestTradeDateWorker extends BatchWorker {
  async batch(params?: Record<string, any>) {
    const res = await getLatestTradeDate().catch(handleWorkerError)
    console.log('[worker] 更新最新交易日完成:', res)
    return res
  }
}

// stockBasicRunner()
// ;(async function () {
//   // console.log(await isLastTradeDay())
//   await new TradeCalendarNextYearUpdateWorker().work()
//   // await new LatestTradeDateWorker().work()
//   // console.log(await nTradeDayAgo(3))
// })()
