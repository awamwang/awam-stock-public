import { CronJob } from 'cron'

import { TIMEZONE, afterTodayTime, timeToCronTime, timer } from '@awamstock/shared'
import { JobOptions } from './util'
import { beforeStart } from '../worker/wrapper'
import { LatestTradeDateWorker, TradeCalendarNextYearUpdateWorker } from '../worker/data/calendar/worker'
import { isLastTradeDay } from '../worker/data/calendar/calendar'
import { 全球市场 } from '../worker/data/long-tou/worker'

const ScheduleTime = '09:00:00'
const 准备 = function 准备(options: JobOptions = {}) {
  const { start, timezone = TIMEZONE } = options
  const runOnInit = afterTodayTime(ScheduleTime) // 如果当前时间在任务时间之后，则在初始化时执行一次

  return new CronJob(
    timeToCronTime(ScheduleTime),
    async function () {
      await beforeStart()

      await new TradeCalendarNextYearUpdateWorker().work()

      await new LatestTradeDateWorker().work()
      await new 全球市场().work()
      if (await isLastTradeDay()) {
        console.log('[schedule] 准备任务结束', timer.updateToday())
      } else {
        console.log('[schedule] 非交易日，不执行准备任务')
      }
    },
    null,
    start || runOnInit,
    timezone,
    null,
    runOnInit
  )
}

export default 准备
