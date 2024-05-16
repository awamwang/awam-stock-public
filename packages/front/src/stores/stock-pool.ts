import { IDataObjectList } from '@awamstock/shared/type'
import { StockPoolType, IStockPool } from '@awamstock/model'
import { groupBy } from 'lodash'

export interface IDingPanStore {
  stockPool: Record<StockPoolType, IStockPool[]>
  stockPoolIndexMap: Record<string, IStockPool>
  yesterdayStockPool: Record<StockPoolType, IStockPool[]>
}

function getLbStockPools(stockPools: IStockPool[] = []) {
  return groupBy(
    stockPools.filter((item) => item.limit_up_days > 0),
    'limit_up_days'
  )
}

const stockPoolTypeSort: Record<StockPoolType, number> = {
  zt: 1,
  zt_broken: 2,
  hot: 3,
  zt_zr: 4,
  dt: 5,
}

function setStockPool(stockPool: Record<StockPoolType, IStockPool[]>, stockPools: IStockPool[] = []) {
  const grouped = groupBy(stockPools, 'type')

  Object.keys(grouped).forEach((key) => {
    if ((key === 'zr_zt' && !stockPool[key as StockPoolType].length) || key !== 'zr_zt') {
      stockPool[key as StockPoolType] = grouped[key]
    }
  })
}

export const useStockPoolStore = defineStore('stockPool', {
  state: (): IDingPanStore => ({
    stockPool: { zt: [], dt: [], zt_broken: [], hot: [], zt_zr: [] },
    stockPoolIndexMap: {},
    yesterdayStockPool: { zt: [], dt: [], zt_broken: [], hot: [], zt_zr: [] },
  }),
  getters: {
    lbStockPools: (state) => getLbStockPools(state.stockPool.zt),
    yesterdayLbStockPools: (state) => getLbStockPools(state.yesterdayStockPool.zt),
    // groupedZtPools: (state) => groupBy(state.stockPool.zt, ''),
  },
  actions: {
    setStockPool(data: IDataObjectList<IStockPool>) {
      data.data.forEach((item) => {
        const has = this.stockPoolIndexMap[item.code]
        if (!has || stockPoolTypeSort[item.type] < stockPoolTypeSort[has.type]) {
          this.stockPoolIndexMap[item.code] = item
        }
      })
      setStockPool(this.stockPool, data.data)
      useGlobalStore().setStrNameMap('stockPool', data.strNameMap)
    },
    setYesterdayStockPool(data: IDataObjectList<IStockPool>) {
      setStockPool(this.yesterdayStockPool, data.data)
      useGlobalStore().setStrNameMap('stockPool', data.strNameMap)
    },
  },
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot))
// }
