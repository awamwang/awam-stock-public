import { JobOptions, getCommonJob } from './util'
import FocusedDepartmentWorker from '../worker/data/focused-department'
import ThsBlockWorker from '../worker/ths/block-getter'
import BlockLinkWorker from '../worker/data/util/block-link'
import DepartmentTradeWorker from '../worker/iwencai/department-trade'
import RiskyDepartmentStockWorker from '../worker/risky/risky-department-stock'
import SafeScoreWorker from '../worker/tdx/safe-score'
import { StockBasicWorker } from '../worker/data/tushare/worker'
import BlockWorker from '../worker/tdx/block'
import { LongTouBlockWorker } from '../worker/data/long-tou/worker'
import { 即时行情 } from './盘中'

export const workers_复盘任务 = [
  new StockBasicWorker(),
  new SafeScoreWorker(),

  new FocusedDepartmentWorker(),
  new DepartmentTradeWorker(),
  new RiskyDepartmentStockWorker(),

  new BlockWorker(),
  new ThsBlockWorker(),
  new LongTouBlockWorker(),
  new BlockLinkWorker(),
]

export async function 复盘任务() {
  // 复盘任务是有顺序的，且不需要尽快结束
  await workers_复盘任务.reduce(
    (prev, next) =>
      prev.then(() => {
        return next.work({})
      }),
    Promise.resolve()
  )
}

const 复盘 = function 复盘(options: JobOptions = {}) {
  return getCommonJob(
    '18:01:00',
    async () => {
      await 复盘任务()
      console.log('[schedule] 复盘更新当日即时行情')
      await 即时行情()
      console.log('[schedule] 复盘任务结束')
    },
    {
      name: '复盘',
      ...options,
    }
  )
}

export default 复盘
