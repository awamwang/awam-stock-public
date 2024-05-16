import { fetchTushare } from './util'
import { parseTushareData } from '@awamstock/shared'
import { Stock, IStock, stockMap, oriStockKeys } from '@awamstock/model'
import { BatchWorker } from '../../worker'
import { handleWorkerError } from '../../exception'

const stockFields = oriStockKeys.filter((k) => !['feature', 'myBlocks'].includes(k))
export async function stockBasic(params: any = {}, fields: Array<string> = stockFields): Promise<any> {
  const resp: any = await fetchTushare({
    api_name: 'stock_basic',
    params: params,
    fields: fields.join(','),
  })

  const stocks = await Promise.all(
    parseTushareData(resp, stockMap).map(async (item: IStock) => {
      await Stock.uniqueUpsert(item)

      return item
    })
  )

  return stocks
}

export class StockBasicWorker extends BatchWorker {
  async batch(params?: Record<string, any>) {
    await stockBasic().catch(handleWorkerError)
    console.log('[worker] 更新股票基本信息完成')
  }
}

// stockBasicRunner()
// ;(async function () {
//   // console.log(await isLastTradeDay())
//   // await new TradeCalendarNextYearUpdateWorker().work()
//   await new LatestTradeDateWorker().work()
//   // console.log(await nTradeDayAgo(3))
// })()
