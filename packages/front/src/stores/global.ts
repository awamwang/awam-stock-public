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
import { DEFAULT_THS_LINKER_WS_URL, LinkMode, thsLinkerClient } from '@/composables/thsLinkerClient'

export interface IGlobalStore {
  stockCode: string
  linkMode: LinkMode
  linkSoftIp: string
  thsLinkerWsUrl: string
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

function normalizeLinkMode(mode: string | null): LinkMode {
  return mode === 'thsLinker' ? 'thsLinker' : 'stocksoftLink'
}

export const useGlobalStore = defineStore('global', {
  state: (): IGlobalStore => ({
    stockCode: '',
    linkMode: 'stocksoftLink',
    linkSoftIp: '',
    thsLinkerWsUrl: DEFAULT_THS_LINKER_WS_URL,
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

    setLinkMode(mode: LinkMode) {
      const next = normalizeLinkMode(mode)
      if (this.linkMode === next) return
      this.linkMode = next
      localStorage.setItem('linkMode', this.linkMode)
    },

    setThsLinkerWsUrl(url: string) {
      const next = url?.trim() || DEFAULT_THS_LINKER_WS_URL
      if (this.thsLinkerWsUrl === next) return
      this.thsLinkerWsUrl = next
      localStorage.setItem('thsLinkerWsUrl', this.thsLinkerWsUrl)
      thsLinkerClient.setUrl(this.thsLinkerWsUrl)
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
      if (this.linkMode === 'thsLinker') {
        thsLinkerClient.jump(code, 'all')
        return
      }
      await setAll({
        code: code,
      })
    },
    async emitStockCodeToOne(soft: IStocksoftWindow, code: string) {
      if (this.linkMode === 'thsLinker') {
        const target = soft.id || 'all'
        thsLinkerClient.jump(code, target)
        return
      }
      if (soft.hwnd) {
        await setOne({
          hwnd: soft.hwnd,
          code: code,
        })
      }
    },
    async emitStockCodeToOneLinked(code: string) {
      if (this.linkMode === 'thsLinker') {
        if (!this.linkedStocksofts?.length) {
          thsLinkerClient.jump(code, 'all')
          return
        }
        this.linkedStocksofts.forEach((s) => {
          this.emitStockCodeToOne(s, code)
        })
        return
      }
      this.linkedStocksofts.forEach((s) => {
        this.emitStockCodeToOne(s, code)
      })
    },

    async loadStorage() {
      this.stockCode = localStorage.getItem('stockCode') || ''
      this.linkMode = normalizeLinkMode(localStorage.getItem('linkMode'))
      this.thsLinkerWsUrl = localStorage.getItem('thsLinkerWsUrl') || DEFAULT_THS_LINKER_WS_URL
      thsLinkerClient.setUrl(this.thsLinkerWsUrl)

      this.setLinkSoftIp(localStorage.getItem('linkSoftIp') || '')
      this.linkedStocksofts = JSON.parse(localStorage.getItem('linkedStocksofts') || '[]')
      if (this.linkMode === 'stocksoftLink') {
        this.setStocksofts(await getStocksofts())
      }
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
