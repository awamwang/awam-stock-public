import { IDataObjectList, IStrNameMap, PlainDataModel } from '@awamstock/shared/type'
import { _ } from '@awamstock/shared/browser'
import {
  IFocusedDepartment,
  IEnvironment,
  IMoodBlockItem,
  IMoodBlockStock,
  IMoodStockItem,
  IMarketMessage,
  IRadar,
  IYiDong,
  IBeforeOpenStock,
  IStockPool,
  IBlockDay,
} from '@awamstock/model'
import { IStocksoftWindow, setLinkSoftUrl, setOne, setAll, list as getStocksofts } from '@/apis/stocksoft'

export interface IGlobalStore {
  stockCode: string
  linkSoftIp: string
  stocksofts: IStocksoftWindow[]
  linkedStocksofts: IStocksoftWindow[]
  focusedDepartments: IFocusedDepartment[]
  focusedDepartmentIndexMap: Record<string, IFocusedDepartment[]>

  strNameMap: {
    focusedDepartment: IStrNameMap<IFocusedDepartment> | undefined
    environment: IStrNameMap<IEnvironment> | undefined
    moodBlock: IStrNameMap<IMoodBlockItem> | undefined
    moodBlockStock: IStrNameMap<IMoodBlockStock> | undefined
    moodStock: IStrNameMap<IMoodStockItem> | undefined
    marketMessage: IStrNameMap<IMarketMessage> | undefined
    radar: IStrNameMap<IRadar> | undefined
    yiDong: IStrNameMap<IYiDong> | undefined
    beforeOpenStock: IStrNameMap<IBeforeOpenStock> | undefined
    stockPool: IStrNameMap<IStockPool> | undefined
    blockDay: IStrNameMap<IBlockDay> | undefined
    [type: string]: IStrNameMap<PlainDataModel> | undefined
  }
}

export const useGlobalStore = defineStore('global', {
  state: (): IGlobalStore => ({
    stockCode: '',
    linkSoftIp: '',
    stocksofts: [],
    linkedStocksofts: [],
    focusedDepartments: [],
    focusedDepartmentIndexMap: {},

    strNameMap: {
      focusedDepartment: {},
      environment: {},
      moodBlock: {},
      moodBlockStock: {},
      moodStock: {},
      marketMessage: {},
      radar: {},
      yiDong: {},
      beforeOpenStock: {},
      stockPool: {},
      blockDay: {},
    },
  }),
  getters: {
    getStrNameMap: (state) => (key: string) => state.strNameMap[key] || {},
  },
  actions: {
    setStrNameMap(type: string, strNameMap?: IStrNameMap<PlainDataModel>) {
      if (_.isEmpty(strNameMap)) {
        return
      }

      this.strNameMap[type] = strNameMap
    },

    setStockCode(code: string) {
      if (code !== this.stockCode) {
        // console.log('[global] setStockCode', code)
        this.stockCode = code
        localStorage.setItem('stockCode', code)
      }
    },

    async setLinkSoftIp(ip: string) {
      if (ip && this.linkSoftIp !== ip) {
        await setLinkSoftUrl((this.linkSoftIp = ip))
        localStorage.setItem('linkSoftIp', this.linkSoftIp)
      }
    },
    setStocksofts(list: IStocksoftWindow[]) {
      if (list) {
        this.stocksofts = list
        localStorage.setItem('stocksofts', JSON.stringify(this.stocksofts))
      }
    },
    setLinkedStocksofts(list: IStocksoftWindow[]) {
      if (list) {
        this.linkedStocksofts = list
        localStorage.setItem('linkedStocksofts', JSON.stringify(this.linkedStocksofts))
      }
    },
    async emitStockCode(code: string) {
      await setAll({
        code: code,
      })
    },
    async emitStockCodeToOne(soft: IStocksoftWindow, code: string) {
      if (soft.hwnd) {
        await setOne({
          hwnd: soft.hwnd,
          code: code,
        })
      }
    },
    async emitStockCodeToOneLinked(code: string) {
      this.linkedStocksofts.forEach((s) => {
        this.emitStockCodeToOne(s, code)
      })
    },

    async loadStorage() {
      this.stockCode = localStorage.getItem('stockCode') || ''

      this.setLinkSoftIp(localStorage.getItem('linkSoftIp') || '')
      this.linkedStocksofts = JSON.parse(localStorage.getItem('linkedStocksofts') || '[]')
      this.setStocksofts(await getStocksofts())
      // this.stocksofts = JSON.parse(localStorage.getItem('stocksofts') || '[]')
    },

    setFocusedDepartments(data: IDataObjectList<IFocusedDepartment>) {
      this.focusedDepartments = data.data
      this.focusedDepartmentIndexMap = data.data.reduce((map, item) => ({ ...map, [item.name]: [...(map[item.name] || []), item] }), {} as Record<string, IFocusedDepartment[]>)
      this.setStrNameMap('focusedDepartment', data.strNameMap)
    },
  },
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot))
// }
