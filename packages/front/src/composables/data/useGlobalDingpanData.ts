import { timer, isBefore } from '@awamstock/shared/browser'
import * as apis from '@/apis/global'

export default function () {
  const global = useGlobalStore()
  const blockStore = useBlockStore()
  const environmentStore = useEnvironmentStore()
  const dingPanStore = useDingPanStore()
  const stockPoolStore = useStockPoolStore()

  async function getDates(date = timer.today()) {
    // const [lastTradeDateResp, tradeCalendars] = await Promise.all([apis.lastTradeDate(), apis.tradeCalendars({ open: 1, end: date, limit: 2 })])
    const tradeCalendars = await apis.tradeCalendars({ open: 1, _end: date, _limit: 2 })

    const [lastTradeDate, preTradeDate] = tradeCalendars.data.map((item) => item.date)
    // const lastTradeDate = String(lastTradeDateResp.data.value)
    const todayIsNotTrade = date !== lastTradeDate
    const dataNotUpdated = !todayIsNotTrade && isBefore(lastTradeDate, date)
    const reqeustDate = lastTradeDate
    // const reqeustDate = dataNotUpdated ? lastTradeDate : currentDate // 代表数据库记录的最新交易日还未更新（当日数据还没有），则使用lastTradeDate请求前一天数据
    console.info(`reqeustDate-${reqeustDate} preTradeDate-${preTradeDate}`)
    // if (dataNotUpdated && reqeustDate !== preTradeDate) {
    //   console.error(`数据可能错误: reqeustDate-${reqeustDate} preTradeDate-${preTradeDate}`)
    // }

    environmentStore.setLastTradeDate(lastTradeDate)
    environmentStore.setCurrentDate(lastTradeDate)
    environmentStore.setPredate(preTradeDate)

    return {
      lastTradeDate,
      reqeustDate,
      // currentDate,
      preTradeDate,
      dataNotUpdated,
      todayIsNotTrade,
    }
  }

  // 请求全局股市数据，初始化时需要执行，交易日变化时需要执行
  async function getGlobalDingpanData(date = timer.today()) {
    const { reqeustDate, preTradeDate, dataNotUpdated, todayIsNotTrade } = await getDates(date)

    // TODO 是否有必要失败处理
    await Promise.all([
      apis.blocks({ _fields: 'code,type,codeList,name,date,from,view,tags,link' }).then(blockStore.setBlocks),
      apis.focusedDepartments({}).then(global.setFocusedDepartments),
      apis.environment({ date: reqeustDate }).then(environmentStore.setEnviroment),
      apis.environment({ date: preTradeDate }).then((yesterdayEnviroment) => {
        if (!dataNotUpdated) {
          environmentStore.setYesterdayEnviroment(yesterdayEnviroment)
        }
      }),
      apis.globalMarkets({ date: reqeustDate, _groupFirst: 'code', _fields: 'code,name,increase_rate' }).then(environmentStore.setGlobalMarket),
      apis.radars({ date: reqeustDate, _fields: '_id,code,name,type,content,lb,time', _sort: '-time' }).then(dingPanStore.updateRadars),
      apis.yiDongs({ date: reqeustDate, _fields: 'id,title,block,time', _sort: '-time' }).then(dingPanStore.updateYiDongs),
      apis.marketMessages({ date: reqeustDate, _fields: 'id,title,summary,content,stocks,blocks,time' }).then(dingPanStore.updateMarketMessages),
      apis.beforeOpenStocks({ date: reqeustDate }).then(dingPanStore.setBeforeOpenStocks),
      apis.blockDays({ date: reqeustDate, _fields: 'code,dt,zt' }).then(blockStore.setBlockDays),
      apis.moodBlocks({ date: reqeustDate, _fields: 'code,name,power,r,rs,m_net,time' }).then(dingPanStore.setMoodBlocks),
      apis.moodBlockStocks({ date: reqeustDate, _fields: 'code,name,pos,lb,r,p,hs,m,m_net,blocks,time', _sort: '-time' }).then(dingPanStore.updateMoodBlockStocks),
      apis.moodStocks({ date: reqeustDate, _fields: 'code,name,r,_sort,change' }).then(dingPanStore.setMoodStocks),
      apis
        .stockPools({ date: reqeustDate, _fields: 'code,name,type,first_limit_up,last_limit_up,limit_up_days,turnover_ratio,surge_reason,updatedAt', _sort: '-updatedAt' })
        .then(stockPoolStore.setStockPool),
      apis
        .stockPools({ date: preTradeDate, _fields: 'code,name,type,first_limit_up,last_limit_up,limit_up_days,turnover_ratio,surge_reason,updatedAt', _sort: '-updatedAt' })
        .then(stockPoolStore.setYesterdayStockPool),
    ])
  }

  return {
    getGlobalDingpanData,
  }
}
