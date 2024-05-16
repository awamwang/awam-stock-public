import { IDataObject, IDataObjectSingleWithMap, IDataObjectSingle, IDataObjectList } from '@awamstock/shared/type'
import { flatListData, toFixed } from '@awamstock/shared/browser'
import { IGlobalConfig, IEnvironment, IGlobalMarket } from '@awamstock/model'
import useGlobalDingpanData from '@/composables/data/useGlobalDingpanData'

export interface IEnvironmentStore {
  lastTradeDate: string
  yesterdayLastTradeDate: string
  currentDate: string
  preDate: string
  enviroment: Partial<IEnvironment>
  yesterdayEnviroment: Partial<IEnvironment>
  globalMarketData: { [key: string]: IGlobalMarket }
}

function formatTemperature(temperature: number) {
  return Number(toFixed(temperature, 0))
}
function formatEnviromentData(enviroment: IDataObject<IEnvironment>): IDataObjectSingleWithMap<IEnvironment> {
  const { data, strNameMap } = flatListData(enviroment)

  if (data) {
    data.temperature = formatTemperature(data.temperature)
    data.v_sh *= 10000
    data.v_ca *= 10000
    data.broken_r *= 100
    data.zt_avg_zr *= 100
  }

  return {
    data,
    strNameMap: strNameMap || {},
  }
}

export const useEnvironmentStore = defineStore('environment', {
  state: (): IEnvironmentStore => ({
    lastTradeDate: '',
    yesterdayLastTradeDate: '',
    currentDate: '',
    preDate: '',
    enviroment: {},
    yesterdayEnviroment: {},
    globalMarketData: {},
  }),
  getters: {
    enviromentToShow: (state) => state.enviroment || state.yesterdayEnviroment,
    temperature: (state) => state.enviroment?.temperature || state.yesterdayEnviroment?.temperature,
    dateToShow: (state) => (state.enviroment ? state.currentDate : state.preDate),
  },
  actions: {
    async setLastTradeDateData(data: IDataObjectSingle<IGlobalConfig>) {
      if (data.data.value !== this.lastTradeDate) {
        this.lastTradeDate = data.data.value as string
        await useGlobalDingpanData().getGlobalDingpanData(this.lastTradeDate)
      }
    },
    setLastTradeDate(date: string) {
      if (date !== this.lastTradeDate) {
        this.lastTradeDate = date
      }
    },
    setYesterdayTradeDate(date: string) {
      if (date !== this.yesterdayLastTradeDate) {
        this.yesterdayLastTradeDate = date
      }
    },

    setCurrentDate(date: string) {
      if (date !== this.currentDate) {
        this.currentDate = date
      }
    },
    setPredate(date: string) {
      if (date !== this.preDate) {
        this.preDate = date
      }
    },

    setEnviroment(enviroment: IDataObject<IEnvironment>) {
      const { data, strNameMap } = formatEnviromentData(enviroment)
      this.enviroment = data
      useGlobalStore().setStrNameMap('enviroment', strNameMap)
    },
    setYesterdayEnviroment(enviroment: IDataObject<IEnvironment>) {
      const { data, strNameMap } = formatEnviromentData(enviroment)
      this.yesterdayEnviroment = data
      useGlobalStore().setStrNameMap('enviroment', strNameMap)
    },

    setGlobalMarket(data: IDataObjectList<IGlobalMarket>) {
      this.globalMarketData = _.keyBy(data.data, 'code')
      useGlobalStore().setStrNameMap('globalMarket', data.strNameMap)
    },
  },
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot))
// }
