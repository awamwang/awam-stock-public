import { CronJob } from 'cron'
import dayjs from 'dayjs'

import { timer } from '@awamstock/shared'
import { JobOptions, getCommonJob } from './util'
import { 大盘, 个股人气, 板块人气, 板块人气个股, 涨停信息, 全球市场, 短线精灵, 板块涨跌 } from '../worker/data/long-tou/worker'
import { 涨停池 } from '../worker/data/ths-limit-up'

/** 涨停池改用同花顺；选股宝股票池已关闭 */
export const workers_涨停池 = [new 涨停池()]
export const workers_即时行情 = [
  new 大盘(),
  new 个股人气(),
  new 板块人气(),
  new 板块人气个股(),
  new 涨停信息(),
  new 全球市场(),
  // new 短线精灵(),
  new 板块涨跌(),
  ...workers_涨停池,
]

/** 连续竞价时段：9:30-11:30、13:00-15:00（与启停控制窗口一致，含 15:00 收盘点） */
export function is盘中交易时段(now = dayjs()): boolean {
  const t = now.format('HH:mm:ss')
  return (t >= '09:30:00' && t < '11:31:00') || (t >= '13:00:00' && t < '15:01:00')
}

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
    // cron 覆盖 9–15 点；实际是否执行由交易时段守卫与启停控制共同约束
    '9-15:*/2:0',
    async () => {
      if (!is盘中交易时段()) {
        return
      }
      await 即时行情()
      console.log(`[worker] 更新 ${timer.nowStr()}`)
    },
    {
      name: '盘中',
      ...options,
      noSkipHint: true,
      noRunOnInit: true,
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
      // 启停控制禁止 runOnInit：午后/收盘后重启时多个补跑会异步竞态，可能把盘中任务重新 start
      { name, ...options, noRunOnInit: true }
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
      // 按当前是否在连续竞价时段决定初始状态（集合竞价由竞价调度单独负责）
      if (is盘中交易时段()) {
        job_盘中.start()
        console.log('[schedule] 盘中已按当前交易时段启动', timer.nowStr())
      }
    },
    stop() {
      job_盘中.stop()
      job_清理盘中.stop()
      job_盘中控制.forEach((item) => item.stop())
    },
  }
}

export default 盘中
