import { IStockPool } from '@awamstock/model'

export interface LbDataItem {
  name: string
  lb: number
  stocks: IStockPool[]
  yesterdayStocks: IStockPool[]
}
export default function useLbStockPool() {
  const lbLimit = ref(5)
  const lbData: LbDataItem[] = reactive(
    [
      { name: '高度板', lb: -1, stocks: [], yesterdayStocks: [] },
      { name: '7板', lb: 7, stocks: [], yesterdayStocks: [] },
      { name: '6板', lb: 6, stocks: [], yesterdayStocks: [] },
      { name: '5板', lb: 5, stocks: [], yesterdayStocks: [] },
      { name: '4板', lb: 4, stocks: [], yesterdayStocks: [] },
      { name: '3板', lb: 3, stocks: [], yesterdayStocks: [] },
      { name: '2板', lb: 2, stocks: [], yesterdayStocks: [] },
      { name: '1板', lb: 1, stocks: [], yesterdayStocks: [] },
    ].filter((item) => item.lb < lbLimit.value)
  )

  const stockPoolStore = useStockPoolStore()
  const lbStockPools = computed(() => stockPoolStore.lbStockPools || {})
  const yesterdayLbStockPools = computed(() => stockPoolStore.yesterdayLbStockPools || {})

  function getLbStocks(lbPool: Record<number, IStockPool[]>, lb: number): IStockPool[] {
    if (lb === -1) {
      return Object.keys(lbPool)
        .map((lb) => Number(lb))
        .filter((lb) => lb >= lbLimit.value)
        .reduce((acc: IStockPool[], lb) => [...acc, ...(lbPool[lb] || [])], [])
    } else if (lb < lbLimit.value) {
      return lbPool[lb] || []
    } else {
      return []
    }
  }

  watch(lbStockPools, () => {
    lbData.forEach((config) => {
      config.stocks = getLbStocks(lbStockPools.value, config.lb)
    })
  })
  watch(yesterdayLbStockPools, () => {
    lbData.forEach((config) => {
      config.yesterdayStocks = getLbStocks(yesterdayLbStockPools.value, config.lb)
    })
  })

  return {
    lbData,
  }
}
