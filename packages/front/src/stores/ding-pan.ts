import { IDataObjectList } from '@awamstock/shared/type'
import { _ } from '@awamstock/shared/browser'
import { IRadar, IYiDong, IMarketMessage, IBeforeOpenStock, IMoodBlockItem, IMoodBlockStock, IMoodStockItem, IBlock } from '@awamstock/model'

export interface IDingPanStore {
  radars: IRadar[]
  yiDongs: IYiDong[]
  marketMessages: IMarketMessage[]
  moodBlocks: IMoodBlockItem[]
  moodBlockStocks: IMoodBlockStock[]
  moodBlockIndexMap: Record<string, IMoodBlockItem>
  moodStocks: IMoodStockItem[]
  beforeOpenStocks: IBeforeOpenStock[]
}

function findByCode<T extends { code: string }>(list: T[], code?: string): Partial<T> {
  return (code && list.find((item) => item.code === code)) || {}
}
function filterByCode<T extends { code: string }>(list: T[], code?: string): T[] {
  return (code && list.filter((item) => item.code === code)) || []
}

export const useDingPanStore = defineStore('dingPan', {
  state: (): IDingPanStore => ({
    radars: [],
    yiDongs: [],
    marketMessages: [],
    moodBlocks: [],
    moodBlockIndexMap: {},
    moodBlockStocks: [],
    moodStocks: [],
    beforeOpenStocks: [],
  }),
  getters: {
    beforeOpenStockGroup(state) {
      const grouped = _.groupBy(state.beforeOpenStocks, 'gn')

      return Object.keys(grouped)
        .map((k) => ({
          gn: k,
          count: grouped[k].length,
        }))
        .sort((a, b) => b.count - a.count)
    },
    getRadarsByCode: (state) => (code?: string) => filterByCode(state.radars, code),
    getRadarsByBlock: (state) => (block: Partial<IBlock>) => useBlockStore().filterStocksByBlock(state.radars, block),
    getYiDongsByTitle: (state) => (keyword?: string) => (keyword && state.yiDongs.filter((yd) => yd.title && yd.title.includes(keyword))) || [],
    getMarketMessagesByName: (state) => (name?: string) =>
      (name && state.marketMessages.filter((mm) => mm.stocks && mm.stocks.some((stock: string) => stock.includes(name)))) || [],
    getMoodStockByCode:
      (state) =>
      (code?: string): Partial<IMoodStockItem> =>
        (code && state.moodStocks?.find((stock: IMoodStockItem) => stock.code === code)) || {},
    getMoodBlocksByCode:
      (state) =>
      (code?: string): IMoodBlockItem[] =>
        (code &&
          state.moodBlocks?.filter((block: IMoodBlockItem) => {
            const fullBlock = useBlockStore().blockIndexMap[block.code]

            return fullBlock?.codeList?.includes(code)
          })) ||
        [],
    getBeforeOpenStockByCode: (state) => (code?: string) => findByCode(state.beforeOpenStocks, code),
  },
  actions: {
    setMoodBlocks(dataObject: IDataObjectList<IMoodBlockItem>) {
      dataObject.data.sort((a, b) => b.power - a.power)
      this.moodBlocks = dataObject.data.map((item, i) => ({ ...item, sort: i + 1 }))
      this.moodBlockIndexMap = this.moodBlocks.reduce((map, block) => ({ ...map, [block.code]: block }), {})
      useGlobalStore().setStrNameMap('moodBlock', dataObject.strNameMap)
    },
    setMoodStocks(dataObject: IDataObjectList<IMoodStockItem>) {
      dataObject.data.sort((a, b) => a.sort - b.sort)
      this.moodStocks = dataObject.data.map((item, i) => ({ ...item, sort: i + 1 }))
      useGlobalStore().setStrNameMap('moodStock', dataObject.strNameMap)
    },
    updateMoodBlockStocks(dataObject: IDataObjectList<IMoodBlockStock>) {
      this.moodBlockStocks = _.uniqWith(
        [...dataObject.data, ...this.moodBlockStocks],
        (arrVal, othVal) => arrVal.block_code === othVal.block_code && arrVal.date === othVal.date && arrVal.code === othVal.code
      ).sort((a, b) => b.time - a.time)
      useGlobalStore().setStrNameMap('moodBlockStock', dataObject.strNameMap)
    },

    // 来自socket的数据，更新
    updateRadars(data: IDataObjectList<IRadar>) {
      this.radars = _.uniqWith([...data.data, ...this.radars], (arrVal, othVal) => arrVal.time === othVal.time && arrVal.code === othVal.code && arrVal.type === othVal.type).sort(
        (a, b) => b.time - a.time
      )
      useGlobalStore().setStrNameMap('radar', data.strNameMap)
    },
    updateYiDongs(data: IDataObjectList<IYiDong>) {
      this.yiDongs = _.uniqBy([...data.data, ...this.yiDongs], 'id').sort((a, b) => b.time - a.time)
      useGlobalStore().setStrNameMap('yiDong', data.strNameMap)
    },
    updateMarketMessages(data: IDataObjectList<IMarketMessage>) {
      this.marketMessages = _.uniqBy([...data.data, ...this.marketMessages], 'id').sort((a, b) => b.time - a.time)
      useGlobalStore().setStrNameMap('marketMessage', data.strNameMap)
    },

    setBeforeOpenStocks(data: IDataObjectList<IBeforeOpenStock>) {
      this.beforeOpenStocks = data.data
      useGlobalStore().setStrNameMap('beforeOpenStock', data.strNameMap)
    },
  },
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot))
// }
