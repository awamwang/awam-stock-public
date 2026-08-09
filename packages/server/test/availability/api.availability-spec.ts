import { api } from '@awamstock/shared/config'

import { assertLongTouPayload, pickField, probeJson, requireEnv, truncateBody } from './probe'

const { baseUrl, headers } = api
const LONG_TOU_APIV = 'w25'

function envToken(name: string): string {
  return process.env[name]?.trim() || ''
}

describe('第三方接口可用性', () => {
  describe('开盘啦 LongTou', () => {
    it('ZhangFuDetail（大盘涨跌统计）应返回 info', async () => {
      const label = '开盘啦/ZhangFuDetail'
      const url = `${baseUrl.LongTou}?a=ZhangFuDetail&apiv=${LONG_TOU_APIV}&c=HomeDingPan&PhoneOSNew=1&`
      const { data } = await probeJson(label, url)
      assertLongTouPayload(label, data, 'info')
      expect(data.info).toEqual(expect.any(Object))
    })

    it('PlateAnalysis（板块分析）应返回 list', async () => {
      const label = '开盘啦/PlateAnalysis'
      const url = `${baseUrl.LongTou}?Order=1&a=PlateAnalysis&st=5&c=HomeDingPan&PhoneOSNew=1&Index=0&PidType=0&apiv=${LONG_TOU_APIV}&Type=2&`
      const { data } = await probeJson(label, url)
      assertLongTouPayload(label, data, 'list')
      const list = pickField(data, 'list')
      expect(Array.isArray(list)).toBe(true)
      expect(list.length).toBeGreaterThan(0)
    })

    it('GetHotPHB（个股人气，需 Token）应返回 List', async () => {
      const label = '开盘啦/GetHotPHB'
      const userId = requireEnv('LONG_TOU_USERID', label)
      const token = requireEnv('LONG_TOU_TOKEN', label)
      const url =
        `${baseUrl.LongTou}?Order=1&a=GetHotPHB&st=5&apiv=${LONG_TOU_APIV}&Type=1&c=StockBidYiDong` +
        `&PhoneOSNew=1&Index=0&UserID=${userId}&Token=${token}&`
      const { data } = await probeJson(label, url)
      assertLongTouPayload(label, data, 'list')
      const list = pickField(data, 'list')
      expect(Array.isArray(list)).toBe(true)
    })
  })

  describe('选股宝 Baoer', () => {
    it('market_indicator/line（市场温度）应返回 data', async () => {
      const label = '选股宝/market_indicator'
      const url =
        `${baseUrl.baoerFlash}/api/market_indicator/line` +
        `?fields=market_temperature,limit_up_broken_count,limit_up_broken_ratio,yesterday_limit_up_avg_pcp`
      const { data } = await probeJson(label, url, { headers: headers.baoer as any })

      if (!Array.isArray(data?.data) || data.data.length === 0) {
        throw new Error(`[${label}] 未返回有效 data 数组\nBody: ${truncateBody(JSON.stringify(data))}`)
      }
      expect(data.data.length).toBeGreaterThan(0)
    })
  })

  describe('东方财富 EastMoney', () => {
    it('kamt.rtmin（北向资金分时）应返回 data', async () => {
      const label = '东方财富/kamt.rtmin'
      const ut = requireEnv('EAST_MONEY_TOKEN', label)
      const url = `${baseUrl.eastmoney}/qt/kamt.rtmin/get?fields1=f1,f3&fields2=f51,f52,f54,f56&ut=${ut}&lmt=1&_=${Date.now()}`
      const { data } = await probeJson(label, url)

      if (data?.data == null) {
        throw new Error(`[${label}] 未返回 data，请检查 EAST_MONEY_TOKEN 或接口状态\nBody: ${truncateBody(JSON.stringify(data))}`)
      }
      expect(data.data).toBeDefined()
    })
  })

  describe('Tushare', () => {
    const tushareToken = envToken('TUSHARE_TOKEN')

    it(tushareToken ? 'stock_basic 应返回 code=0' : 'stock_basic（未配置 TUSHARE_TOKEN，跳过）', async () => {
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

      // 0=成功；40203=频次超限（说明鉴权与连通正常，视为可用）
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
    it('tool_trade_date_hist_sina（交易日历）应返回数组', async () => {
      const label = 'AkTools/tool_trade_date_hist_sina'
      const url = `${baseUrl.aktools}/api/public/tool_trade_date_hist_sina`

      let data: any
      try {
        ;({ data } = await probeJson(label, url))
      } catch (err: any) {
        const message = String(err?.message || err)
        // 本地服务未启动时跳过，但仍输出完整错误信息便于排查
        if (message.includes('网络请求失败')) {
          console.warn(`[skip] ${label}: ${message}\n请先启动 packages/akshare 服务后再验证`)
          return
        }
        throw err
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`[${label}] 未返回交易日数组，请确认本地 AkTools 已启动 (${baseUrl.aktools})\nBody: ${truncateBody(JSON.stringify(data))}`)
      }
      expect(data.length).toBeGreaterThan(0)
    })
  })
})
