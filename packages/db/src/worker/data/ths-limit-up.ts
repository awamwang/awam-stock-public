/**
 * 同花顺 dataapi 涨停池（limit_up_pool）
 * 对照来源：wzslinker「涨停聚焦」面板
 */
import { timer } from '@awamstock/shared'
import { myFetch, baseUrl, headers } from '../../lib/api-fetch/index'

/** 与 shared config.api.baseUrl.thsData 保持一致（避免 dist 未重建时类型/运行时缺失） */
const THS_DATA_API = (baseUrl as Record<string, string>).thsData || 'https://data.10jqka.com.cn/dataapi'
const ThsHeaders =
  (headers as Record<string, Headers>).thsData ||
  new Headers({
    accept: 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9',
    origin: 'https://data.10jqka.com.cn',
    referer: 'https://data.10jqka.com.cn/',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  })

/** 与 wzslinker 涨停池请求字段一致 */
export const LIMIT_UP_POOL_FIELDS =
  '199112,10,9001,330323,330324,330325,9002,330329,133971,133970,1968584,3475914,9003,9004'

export interface ThsLimitUpPoolItem {
  code: string
  name: string
  latest?: number
  change_rate?: number
  high_days?: string
  first_limit_up_time?: string
  last_limit_up_time?: string
  limit_up_type?: string
  reason_type?: string | null
  order_amount?: number
  turnover_rate?: number
  [key: string]: unknown
}

export interface ThsLimitUpPoolResponse {
  status_code: number
  status_msg?: string
  data?: {
    info?: ThsLimitUpPoolItem[]
    page?: { limit: number; total: number; count: number; page: number }
    limit_up_count?: { today?: { num?: number } }
    date?: string
    trade_status?: { id?: string; name?: string }
  }
}

export interface FetchLimitUpPoolParams {
  date?: string
  page?: number
  limit?: number
  filter?: string
  orderField?: string
  orderType?: 0 | 1
  field?: string
}

/** 拉取同花顺今日涨停池 */
export async function fetchLimitUpPool(params: FetchLimitUpPoolParams = {}): Promise<ThsLimitUpPoolResponse> {
  const {
    date = timer.today(),
    page = 1,
    limit = 200,
    filter = 'HS,GEM2STAR,ST',
    orderField = '330324',
    orderType = 0,
    field = LIMIT_UP_POOL_FIELDS,
  } = params

  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    field,
    filter,
    order_field: orderField,
    order_type: String(orderType),
    date,
  })

  const url = `${THS_DATA_API}/limit_up/limit_up_pool?${qs.toString()}`
  const res = (await myFetch(url, { headers: ThsHeaders })) as ThsLimitUpPoolResponse | undefined

  if (!res || typeof res !== 'object') {
    throw new Error(`同花顺 limit_up_pool 无响应: ${url}`)
  }
  if (res.status_code !== 0) {
    throw new Error(`同花顺 limit_up_pool 失败: status_code=${res.status_code}, status_msg=${res.status_msg ?? ''}`)
  }

  return res
}

async function run() {
  const res = await fetchLimitUpPool({ limit: 5 })
  const list = res.data?.info ?? []
  const total = res.data?.page?.total ?? list.length
  const ztNum = res.data?.limit_up_count?.today?.num

  console.log(`[ths] date=${res.data?.date} trade=${res.data?.trade_status?.name ?? '-'} total=${total} ztNum=${ztNum ?? '-'}`)
  for (const item of list) {
    console.log(
      `  ${item.code} ${item.name} ${item.high_days ?? ''} 涨幅=${item.change_rate ?? '-'}% 现价=${item.latest ?? '-'} 原因=${item.reason_type ?? '-'}`
    )
  }
}

// 本地探测：pnpm --filter @awamstock/db run probe:ths-limit-up
if (require.main === module) {
  run().catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
}
