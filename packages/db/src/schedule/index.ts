import { CronJob } from 'cron'
import { timer } from '@awamstock/shared'

import 准备 from './准备'
import 复盘 from './复盘'
import 竞价 from './竞价'
import 盘中 from './盘中'

export interface LikeCronJob {
  start(): void
  stop(): void
}
export interface IScheduler {
  (): void
  jobs: CronJob[] | LikeCronJob[]
}

export default async function startJobs(): Promise<IScheduler> {
  console.log('[schedule] start', timer.today())

  const jobs = [准备(), 复盘(), 竞价(), 盘中()]
  // 盘中.start()

  jobs.forEach((item) => item.start())

  // 测试.start()

  function stopJobs() {
    jobs.forEach((item) => item.stop())
    // 测试.stop()
  }

  stopJobs.jobs = jobs

  return stopJobs
}

// main().catch(console.error)
