import { CronJob } from 'cron'

import { timer } from '@awamstock/shared'
import { JobOptions, getCommonJob } from './util'
import { 大盘, 个股人气, 板块人气, 板块人气个股, 涨停信息, 全球市场, 短线精灵, 板块涨跌 } from '../worker/data/long-tou/worker'
import { 市场消息, 大盘异动, 涨停池, 跌停池, 炸板池, 强势股池 } from '../worker/data/baoer'

export const workers_baoer行情 = [new 市场消息(), new 大盘异动(), new 涨停池(), new 跌停池(), new 炸板池(), new 强势股池()]
export const workers_即时行情 = [
  new 大盘(),
  new 个股人气(),
  new 板块人气(),
  new 板块人气个股(),
  new 涨停信息(),
  new 全球市场(),
  // new 短线精灵(),
  new 板块涨跌(),
  ...workers_baoer行情,
]

export async function 即时行情() {
  return await Promise.all(
    workers_即时行情.map((worker) => {
      return worker.work()
    })
  )
}

function getJob_盘中(options: JobOptions = {}) {
  return getCommonJob(
    // '9-15:*:*/30',
    '9-15:*/2:0',
    async () => {
      await 即时行情()
      console.log(`[worker] 更新 ${timer.nowStr()}`)
    },
    {
      name: '盘中',
      ...options,
      noSkipHint: true,
    }
  )
}

function getJob_清理盘中(options: JobOptions = {}) {
  return getCommonJob(
    '23:00:00',
    async () => {
      console.time('[worker] 清理盘中完成')
      await Promise.all(workers_即时行情.map((worker) => worker.archive()))
      console.timeEnd('[worker] 清理盘中完成')
    },
    {
      name: '清理盘中',
      ...options,
    }
  )
}

const Config_盘中控制 = [
  ['盘中开始1', '9:30:0', 'start'],
  ['盘中结束1', '11:31:0', 'stop'],
  ['盘中开始2', '13:0:0', 'start'],
  ['盘中结束2', '15:1:0', 'stop'],
]
function getJob_盘中控制(job_盘中: CronJob, options: JobOptions = {}): CronJob[] {
  return Config_盘中控制.map(([name, scheduleTime, action]) => {
    return getCommonJob(
      scheduleTime,
      async () => {
        console.log('[schedule]', name, timer.nowStr())
        job_盘中[action as 'start' | 'stop']()
      },
      { name, ...options }
    )
  })
}

const 盘中 = function 盘中(options?: any) {
  const job_盘中 = getJob_盘中(options)
  const job_清理盘中 = getJob_清理盘中(options)
  const job_盘中控制 = getJob_盘中控制(job_盘中, options)

  return {
    start() {
      job_清理盘中.start()
      job_盘中控制.forEach((item) => item.start())
    },
    stop() {
      job_盘中.stop()
      job_清理盘中.stop()
      job_盘中控制.forEach((item) => item.stop())
    },
  }
}

export default 盘中
