import { CronJob } from 'cron'

import { TIMEZONE, afterTodayTime, timeToCronTime, UNKNOWN } from '@awamstock/shared'
import { beforeStart } from './../worker/wrapper'
import { isLastTradeDay } from '../worker/data/calendar/calendar'

export interface JobOptions {
  name?: string
  start?: boolean
  timezone?: string
  noSkipHint?: boolean
}

export function getCommonJob(scheduleTime: string, onTick: () => Promise<void>, options: JobOptions = {}) {
  const { name = UNKNOWN, start, timezone = TIMEZONE, noSkipHint } = options
  const runOnInit = afterTodayTime(scheduleTime) // 如果当前时间在任务时间之后，则在初始化时执行一次

  return new CronJob(
    timeToCronTime(scheduleTime),
    async function () {
      await beforeStart()

      if (await isLastTradeDay()) {
        await onTick()
      } else {
        !noSkipHint && console.log(`[schedule] 非交易日，不执行${name}任务`)
      }
    },
    null,
    start || runOnInit,
    timezone,
    null,
    runOnInit
  )
}
