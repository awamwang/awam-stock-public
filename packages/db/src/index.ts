import '@awamstock/model/mongoose'

import '@awamstock/shared/config'
import FocusedDepartmentWorker from './worker/data/focused-department'
import DepartmentTradeWorker from './worker/iwencai/department-trade'
import RiskyDepartmentStockWorker from './worker/risky/risky-department-stock'
import { StockBasicWorker } from './worker/data/tushare/worker'
import { TradeCalendarWorker } from './worker/data/calendar//worker'
import BlockWorker from './worker/tdx/block'
import { afterAll } from './worker/wrapper'
import runJobs from './schedule/index'

async function main() {
  // const date = undefined
  const date = '20220617'

  // await new TradeCalendarWorker().work()

  // await new FocusedDepartmentWorker().work({ date })
  // await new StockBasicWorker().work({ date }) // 更新股票基本信息
  // await new BlockWorker().work({ date })
  // await new DepartmentTradeWorker().work({ date })
  // await new RiskyDepartmentStockWorker().work({ date })

  await runJobs()
  // await afterAll()
}

main().catch(console.error)

process.on('SIGINT', async function () {
  await afterAll()

  process.exit(0)
})

export default {}
