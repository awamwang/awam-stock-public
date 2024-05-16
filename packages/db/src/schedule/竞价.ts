import { timer } from '@awamstock/shared'
import { JobOptions, getCommonJob } from './util'
import { 竞价个股异动 } from '../worker/data/long-tou/worker'
import { 昨日涨停池 } from '../worker/data/baoer'

export default function 竞价(options?: JobOptions) {
  const 竞价盯盘 = getCommonJob(
    '9:15-25:*/30',
    async () => {
      await new 竞价个股异动({ saveData: false }).work()
    },
    {
      name: '竞价盯盘',
      ...options,
      noSkipHint: true,
    }
  )
  const 竞价保存 = getCommonJob(
    '09:25:10',
    async () => {
      await new 昨日涨停池().work()
      await new 竞价个股异动().work()
      console.log('[schedule] 竞价保存结束', timer.updateToday())
    },
    {
      name: '竞价保存',
      ...options,
    }
  )

  return {
    start() {
      竞价盯盘.start()
      竞价保存.start()
    },
    stop() {
      竞价盯盘.stop()
      竞价保存.stop()
    },
  }
}
