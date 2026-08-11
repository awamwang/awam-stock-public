import { CronJob } from 'cron'

import { TIMEZONE, afterTodayTime, timeToCronTime, UNKNOWN } from '@awamstock/shared'
import { beforeStart } from './../worker/wrapper'
import { isLastTradeDay } from '../worker/data/calendar/calendar'

export interface JobOptions {
  name?: string
  start?: boolean
  timezone?: string
  noSkipHint?: boolean
  /** 为 true 时不在初始化时补跑（用于启停控制类任务，避免多个 runOnInit 异步竞态） */
  noRunOnInit?: boolean
}

export function getCommonJob(scheduleTime: string, onTick: () => Promise<void>, options: JobOptions = {}) {
  const { name = UNKNOWN, start, timezone = TIMEZONE, noSkipHint, noRunOnInit } = options
  // 如果当前时间在任务时间之后，则在初始化时执行一次（可用 noRunOnInit 关闭）
  const runOnInit = noRunOnInit ? false : afterTodayTime(scheduleTime)

  return CronJob.from({
    cronTime: timeToCronTime(scheduleTime),
    onTick: async function () {
      await beforeStart()

      if (await isLastTradeDay()) {
        await onTick()
      } else {
        !noSkipHint && console.log(`[schedule] 非交易日，不执行${name}任务`)
      }
    },
    start: start || runOnInit,
    timeZone: timezone,
    runOnInit,
  })
}
