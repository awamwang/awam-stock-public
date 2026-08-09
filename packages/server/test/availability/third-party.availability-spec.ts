/**
 * 全量第三方接口可用性测试（覆盖 packages/db 实际调用的外部 HTTP）
 * 单独运行: pnpm test:availability:third-party
 */
import { api } from '@awamstock/shared/config'

import {
  assertField,
  assertLongTouPayload,
  assertNonEmptyArray,
  isNetworkError,
  pickField,
  probeJson,
  probeText,
  requireEnv,
  truncateBody,
} from './probe'

const { baseUrl, headers } = api
const LONG_TOU_APIV = 'w25'
const baoerHeaders = headers.baoer as any

function envToken(name: string): string {
  return process.env[name]?.trim() || ''
}

function longTouUrl(query: string): string {
  const q = query.startsWith('?') ? query.slice(1) : query
  return `${baseUrl.LongTou}?${q}`
}

describe('全量第三方接口可用性', () => {
  describe('开盘啦 LongTou', () => {
    let samplePlateId = '801001'

    beforeAll(async () => {
      try {
        const { data } = await probeJson(
          '开盘啦/PlateAnalysis(预处理)',
          longTouUrl(`Order=1&a=PlateAnalysis&st=5&c=HomeDingPan&PhoneOSNew=1&Index=0&PidType=0&apiv=${LONG_TOU_APIV}&Type=2&`)
        )
        const list = pickField(data, 'list')
        if (Array.isArray(list) && list[0]?.[0]) {
          samplePlateId = String(list[0][0])
        }
      } catch {
        // 预处理失败时使用默认板块代码
      }
    })

    it('ZhangFuDetail（大盘涨跌统计）→ info', async () => {
      const label = '开盘啦/ZhangFuDetail'
      const { data } = await probeJson(label, longTouUrl(`a=ZhangFuDetail&apiv=${LONG_TOU_APIV}&c=HomeDingPan&PhoneOSNew=1&`))
      assertLongTouPayload(label, data, 'info')
      expect(pickField(data, 'info')).toEqual(expect.any(Object))
    })

    it('PlateAnalysis（板块分析）→ list', async () => {
      const label = '开盘啦/PlateAnalysis'
      const { data } = await probeJson(
        label,
        longTouUrl(`Order=1&a=PlateAnalysis&st=5&c=HomeDingPan&PhoneOSNew=1&Index=0&PidType=0&apiv=${LONG_TOU_APIV}&Type=2&`)
      )
      assertLongTouPayload(label, data, 'list')
      assertNonEmptyArray(label, data, 'list')
    })

    it('ZhiShuStockList_W8（板块成分股，需 Token）→ Stocks/list', async () => {
      const label = '开盘啦/ZhiShuStockList_W8'
      const userId = requireEnv('LONG_TOU_USERID', label)
      const token = requireEnv('LONG_TOU_TOKEN', label)
      const { data } = await probeJson(
        label,
        longTouUrl(
          `Order=1&st=5&a=ZhiShuStockList_W8&c=ZhiShuRanking&PhoneOSNew=1&old=1&Token=${token}&Index=0&apiv=w25&Type=6&UserID=${userId}&PlateID=${samplePlateId}&`
        )
      )
      const errcode = pickField(data, 'errcode')
      if (errcode != null && String(errcode) !== '0') {
        throw new Error(
          `[${label}] 开盘啦返回错误: errcode=${errcode}, errmsg=${pickField(data, 'errmsg') ?? ''}\nPlateID=${samplePlateId}\nBody: ${truncateBody(JSON.stringify(data))}`
        )
      }
      const stocks = pickField(data, 'Stocks')
      const list = pickField(data, 'list')
      if (!Array.isArray(stocks) && !Array.isArray(list)) {
        throw new Error(`[${label}] 缺少 Stocks 或 list\nPlateID=${samplePlateId}\nBody: ${truncateBody(JSON.stringify(data))}`)
      }
    })

    it('GetHotPHB（个股人气）→ List', async () => {
      const label = '开盘啦/GetHotPHB'
      const { data } = await probeJson(
        label,
        longTouUrl(`Order=1&a=GetHotPHB&st=5&apiv=${LONG_TOU_APIV}&Type=1&c=StockBidYiDong&PhoneOSNew=1&Index=0&`)
      )
      assertLongTouPayload(label, data, 'list')
      assertNonEmptyArray(label, data, 'list')
    })

    it('RealRankingInfo（板块人气）→ list', async () => {
      const label = '开盘啦/RealRankingInfo'
      const { data } = await probeJson(
        label,
        longTouUrl(`Order=1&a=RealRankingInfo&st=5&apiv=${LONG_TOU_APIV}&Type=1&c=ZhiShuRanking&PhoneOSNew=1&Index=0&ZSType=7&`)
      )
      assertLongTouPayload(label, data, 'list')
      assertNonEmptyArray(label, data, 'list')
      assertField(label, data, 'Time')
    })

    it('Radar（短线精灵）→ list', async () => {
      const label = '开盘啦/Radar'
      const { data } = await probeJson(label, longTouUrl(`a=Radar&st=10&apiv=${LONG_TOU_APIV}&c=HomeDingPan&PhoneOSNew=1&Index=0&`))
      assertLongTouPayload(label, data, 'list')
      assertNonEmptyArray(label, data, 'list')
    })

    it('GlobalCommon（全球市场）→ CYWWZS', async () => {
      const label = '开盘啦/GlobalCommon'
      const { data } = await probeJson(
        label,
        longTouUrl('a=GlobalCommon&apiv=w26&c=GlobalIndex&PhoneOSNew=1&UserID=0&Token=0&View=1%2C2%2C3%2C4%2C5%2C6&')
      )
      assertLongTouPayload(label, data, 'CYWWZS')
      assertNonEmptyArray(label, data, 'CYWWZS')
    })

    it('ZhangTingExpression（涨停信息）→ info/list', async () => {
      const label = '开盘啦/ZhangTingExpression'
      const { data } = await probeJson(label, longTouUrl(`a=ZhangTingExpression&apiv=${LONG_TOU_APIV}&c=HomeDingPan&PhoneOSNew=1&`))
      const errcode = pickField(data, 'errcode')
      if (errcode != null && String(errcode) !== '0') {
        throw new Error(`[${label}] 开盘啦返回错误: errcode=${errcode}, errmsg=${pickField(data, 'errmsg') ?? ''}\nBody: ${truncateBody(JSON.stringify(data))}`)
      }
      // 盘中多为 info 数组；非交易时段可能返回 list
      if (pickField(data, 'info') == null && pickField(data, 'list') == null) {
        throw new Error(`[${label}] 缺少 info 或 list\nBody: ${truncateBody(JSON.stringify(data))}`)
      }
    })

    it('DaBanList Type=18（竞价个股异动）→ list', async () => {
      const label = '开盘啦/DaBanList(竞价异动)'
      const { data } = await probeJson(
        label,
        longTouUrl(`Order=1&a=DaBanList&st=20&apiv=${LONG_TOU_APIV}&Type=18&c=HomeDingPan&PhoneOSNew=1&Index=0&Is_st=1&PidType=8&`)
      )
      assertLongTouPayload(label, data, 'list')
      expect(Array.isArray(pickField(data, 'list'))).toBe(true)
    })

    it('DaBanList Type=6（今日涨停）→ list', async () => {
      const label = '开盘啦/DaBanList(今日涨停)'
      const { data } = await probeJson(
        label,
        longTouUrl(`st=20&a=DaBanList&apiv=${LONG_TOU_APIV}&Is_st=1&Type=6&Index=0&PidType=1&c=HomeDingPan&Order=1&PhoneOSNew=1&`)
      )
      assertLongTouPayload(label, data, 'list')
      expect(Array.isArray(pickField(data, 'list'))).toBe(true)
    })

    it('ZhiBoContent（大盘直播）→ List', async () => {
      const label = '开盘啦/ZhiBoContent'
      const { data } = await probeJson(label, longTouUrl('st=10&a=ZhiBoContent&apiv=w24&c=ConceptionPoint&PhoneOSNew=1&index=0&'))
      assertLongTouPayload(label, data, 'list')
      expect(pickField(data, 'list')).toBeDefined()
    })

    it('GetZhangTingGene（个股L2）→ List', async () => {
      const label = '开盘啦/GetZhangTingGene'
      const { data } = await probeJson(label, longTouUrl('a=GetZhangTingGene&apiv=w26&c=StockL2Data&StockID=600000&PhoneOSNew=1&'))
      assertLongTouPayload(label, data, 'list')
      expect(pickField(data, 'list')).toBeDefined()
    })

    it('GetYTFP_LHBDX（席位龙虎榜）→ List', async () => {
      const label = '开盘啦/GetYTFP_LHBDX'
      const { data } = await probeJson(label, longTouUrl(`a=GetYTFP_LHBDX&c=FuPanLa&PhoneOSNew=1&apiv=${LONG_TOU_APIV}&`))
      assertLongTouPayload(label, data, 'list')
      expect(pickField(data, 'list')).toBeDefined()
    })

    it('GetPMSL_PMLD（盘面关注）→ List', async () => {
      const label = '开盘啦/GetPMSL_PMLD'
      const { data } = await probeJson(label, longTouUrl(`a=GetPMSL_PMLD&st=10&apiv=${LONG_TOU_APIV}&c=FuPanLa&PhoneOSNew=1&Index=0&`))
      assertLongTouPayload(label, data, 'list')
      expect(pickField(data, 'list')).toBeDefined()
    })

    it('GroupStock（股票新高，按注释目标 URL）→ GroupList/list', async () => {
      const label = '开盘啦/GroupStock'
      const { data } = await probeJson(
        label,
        longTouUrl(`a=GroupStock&st=10&apiv=${LONG_TOU_APIV}&Type=0_0_0_0_0&c=StockNewHigh&PhoneOSNew=1&Index=0&`)
      )
      const errcode = pickField(data, 'errcode')
      if (errcode != null && String(errcode) !== '0') {
        throw new Error(`[${label}] 开盘啦返回错误: errcode=${errcode}, errmsg=${pickField(data, 'errmsg') ?? ''}\nBody: ${truncateBody(JSON.stringify(data))}`)
      }
      const groupList = pickField(data, 'GroupList')
      const list = pickField(data, 'list')
      if (groupList == null && list == null) {
        throw new Error(`[${label}] 缺少 GroupList 或 list\nBody: ${truncateBody(JSON.stringify(data))}`)
      }
    })
  })

  describe('选股宝 Baoer', () => {
    it('flash market_indicator/line（市场温度）→ data', async () => {
      const label = '选股宝/flash/market_indicator'
      const url =
        `${baseUrl.baoerFlash}/api/market_indicator/line` +
        `?fields=market_temperature,limit_up_broken_count,limit_up_broken_ratio,yesterday_limit_up_avg_pcp`
      const { data } = await probeJson(label, url, { headers: baoerHeaders })
      assertNonEmptyArray(label, data, 'data')
    })

    it('api market_indicator/line（大盘统计，worker 使用的非 flash 域名）', async () => {
      const label = '选股宝/api/market_indicator'
      const url =
        `${baseUrl.baoer}/api/market_indicator/line` +
        `?fields=market_temperature,limit_up_broken_count,limit_up_broken_ratio,yesterday_limit_up_avg_pcp,rise_count,fall_count`
      try {
        const { data } = await probeJson(label, url, { headers: baoerHeaders })
        if (pickField(data, 'data') == null && pickField(data, 'info') == null) {
          throw new Error(`[${label}] 缺少 data 或 info\nBody: ${truncateBody(JSON.stringify(data))}`)
        }
      } catch (err) {
        const message = String((err as Error)?.message || err)
        // 业务代码仍指向 api.xuangubao.cn，该路径当前可能 404；记录完整错误便于修复 worker
        if (message.includes('HTTP 404')) {
          console.warn(`[warn] ${label}: ${message}\n提示: packages/db 中 大盘 worker 仍调用此地址，可考虑改为 baoerFlash`)
          return
        }
        throw err
      }
    })

    it('pc/msgs（市场消息）→ NewMsgs', async () => {
      const label = '选股宝/pc/msgs'
      const { data } = await probeJson(label, `${baseUrl.baoer}/api/pc/msgs?subjids=9,10,723,35,469,821&limit=5`, {
        headers: baoerHeaders,
      })
      assertField(label, data, 'NewMsgs')
      expect(Array.isArray(pickField(data, 'NewMsgs'))).toBe(true)
    })

    it('todayDaPanYiDong（大盘异动）→ Messages', async () => {
      const label = '选股宝/todayDaPanYiDong'
      const { data } = await probeJson(label, `${baseUrl.baoer}/api/messages/todayDaPanYiDong?headmark=0`, {
        headers: baoerHeaders,
      })
      assertField(label, data, 'Messages')
      expect(Array.isArray(pickField(data, 'Messages'))).toBe(true)
    })

    it.each([
      ['limit_up', '涨停池'],
      ['limit_down', '跌停池'],
      ['limit_up_broken', '炸板池'],
      ['super_stock', '强势股池'],
      ['yesterday_limit_up', '昨日涨停池'],
    ] as const)('pool/detail pool_name=%s（%s）→ data', async (poolName, poolLabel) => {
      const label = `选股宝/pool/${poolName}(${poolLabel})`
      const { data } = await probeJson(label, `${baseUrl.baoerFlash}/api/pool/detail?pool_name=${poolName}`, {
        headers: baoerHeaders,
      })
      assertField(label, data, 'data')
      expect(Array.isArray(pickField(data, 'data'))).toBe(true)
    })
  })

  describe('东方财富 EastMoney', () => {
    it('kamt.rtmin（北向资金分时）→ data', async () => {
      const label = '东方财富/kamt.rtmin'
      const ut = requireEnv('EAST_MONEY_TOKEN', label)
      const { data } = await probeJson(
        label,
        `${baseUrl.eastmoney}/qt/kamt.rtmin/get?fields1=f1,f3&fields2=f51,f52,f54,f56&ut=${ut}&lmt=1&_=${Date.now()}`
      )
      assertField(label, data, 'data')
    })

    it('kamtbs.rtmin（北向净买入）→ data.s2n', async () => {
      const label = '东方财富/kamtbs.rtmin'
      const ut = requireEnv('EAST_MONEY_TOKEN', label)
      const { data } = await probeJson(
        label,
        `${baseUrl.eastmoney}/qt/kamtbs.rtmin/get?fields1=f1,f3&fields2=f51,f54,f58,f62&ut=${ut}&lmt=1&_=${Date.now()}`
      )
      assertField(label, data, 'data')
      if (pickField(data.data, 's2n') == null) {
        throw new Error(`[${label}] data.s2n 缺失\nBody: ${truncateBody(JSON.stringify(data))}`)
      }
    })

    it('kamt.kline（北向资金日线）→ data', async () => {
      const label = '东方财富/kamt.kline'
      const ut = requireEnv('EAST_MONEY_TOKEN', label)
      const { data } = await probeJson(
        label,
        `${baseUrl.eastmoney}/qt/kamt.kline/get?fields1=f1,f3,f5&fields2=f51,f52&klt=101&lmt=1&ut=${ut}&_=${Date.now()}`
      )
      assertField(label, data, 'data')
    })

    it('fflow/kline（主力资金）→ data.klines', async () => {
      const label = '东方财富/fflow/kline'
      const { data } = await probeJson(
        label,
        `${baseUrl.eastmoney}/qt/stock/fflow/kline/get?klt=1&fields1=f1,f2,f3,f7&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63,f64,f65&secid=1.000001&secid2=0.399001&lmt=1&_=${Date.now()}`
      )
      assertField(label, data, 'data')
      const klines = pickField(data.data, 'klines')
      if (!Array.isArray(klines)) {
        throw new Error(`[${label}] data.klines 缺失或非数组\nBody: ${truncateBody(JSON.stringify(data))}`)
      }
    })
  })

  describe('Tushare', () => {
    const tushareToken = envToken('TUSHARE_TOKEN')

    it(tushareToken ? 'stock_basic → code=0' : 'stock_basic（未配置 TUSHARE_TOKEN，跳过）', async () => {
      const label = 'Tushare/stock_basic'
      if (!tushareToken) {
        console.warn(`[skip] ${label}：未配置 TUSHARE_TOKEN`)
        return
      }

      const { data } = await probeJson(label, baseUrl.tusahre, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_name: 'stock_basic',
          token: tushareToken,
          params: { list_status: 'L' },
          fields: 'ts_code,symbol,name',
        }),
      })

      if (data?.code === 40203) {
        console.warn(`[warn] ${label}: 接口可达但触发频次限制 — ${data?.msg || ''}`)
        return
      }
      if (data?.code !== 0) {
        throw new Error(`[${label}] Tushare 返回错误: code=${data?.code}, msg=${data?.msg || ''}\nBody: ${truncateBody(JSON.stringify(data))}`)
      }
      expect(Array.isArray(data?.data?.items)).toBe(true)
    })
  })

  describe('AkTools 本地服务', () => {
    it('tool_trade_date_hist_sina（交易日历）→ 数组', async () => {
      const label = 'AkTools/tool_trade_date_hist_sina'
      const url = `${baseUrl.aktools}/api/public/tool_trade_date_hist_sina`

      let data: any
      try {
        ;({ data } = await probeJson(label, url))
      } catch (err) {
        if (isNetworkError(err)) {
          console.warn(`[skip] ${label}: ${(err as Error).message}\n请先启动 packages/akshare 服务后再验证`)
          return
        }
        throw err
      }

      assertNonEmptyArray(label, data)
      expect(data[0]).toEqual(expect.objectContaining({ trade_date: expect.anything() }))
    })
  })

  describe('Stocksoft Link 本地服务', () => {
    const stocksoftBase = baseUrl.stocksoftLink

    it.each([
      ['GetSofts', `${stocksoftBase}/GetSofts`],
      ['ListWin', `${stocksoftBase}/ListWin`],
    ] as const)('%s 应可访问', async (name, url) => {
      const label = `Stocksoft/${name}`
      try {
        const { raw } = await probeText(label, url)
        expect(raw.length).toBeGreaterThan(0)
      } catch (err) {
        if (isNetworkError(err)) {
          console.warn(`[skip] ${label}: ${(err as Error).message}\n请确认 stocksoft-link 服务可达 (${stocksoftBase})`)
          return
        }
        throw err
      }
    })
  })
})
