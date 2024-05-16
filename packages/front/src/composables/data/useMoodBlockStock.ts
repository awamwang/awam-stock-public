import { IBlock, IMoodBlockStock } from '@awamstock/model'
import { compareStockPosition } from '@awamstock/shared/browser'

export default function useMoodBlockStock() {
  const blockStore = useBlockStore()
  const dingPanStore = useDingPanStore()
  const stockPoolStore = useStockPoolStore()

  const getSortedStocks = <T extends IMoodBlockStock>(stocks: T[]): T[] => {
    return stocks
      .map((stock) => {
        return {
          ...stock,
          first_limit_up: stockPoolStore.stockPoolIndexMap[stock.code]?.first_limit_up || null,
          limit_up_days: stockPoolStore.stockPoolIndexMap[stock.code]?.limit_up_days || null,
        }
      })
      .sort((a, b) => b.r - a.r)
      .sort((a, b) => compareStockPosition(a.pos, b.pos))
      .sort((a, b) => Number(b.limit_up_days) - Number(a.limit_up_days))
  }

  const getSortedMoodBlockStocks = (block?: IBlock) => {
    const stocks = block ? blockStore.filterStocksByBlock(dingPanStore.moodBlockStocks, block) : dingPanStore.moodBlockStocks

    return getSortedStocks(stocks)
  }

  return {
    getSortedStocks,
    getSortedMoodBlockStocks,
  }
}
