/**
 * 同花顺 dataapi 涨停池（limit_up_pool）
 * 对照来源：wzslinker「涨停聚焦」面板；入库结构对齐选股宝 StockPool
 */
import { timer, SocketDataType, ensureArray } from '@awamstock/shared'
import { IStockPool, StockPool } from '@awamstock/model'
import { DataWorker } from '../worker'
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
  high_days_value?: number
  first_limit_up_time?: string | number
  last_limit_up_time?: string | number
  limit_up_type?: string
  reason_type?: string | null
  order_amount?: number
  order_volume?: number
  turnover_rate?: number
  currency_value?: number
  open_num?: number | null
  is_new?: number
  is_again_limit?: number
  change_tag?: string
  market_type?: string
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

/** 解析「4天4板」「首板」「3天2板」→ 连板天数/板数 */
export function parseHighDays(highDays?: string): { limit_up_days: number; m_days_n_boards_days: number; m_days_n_boards_boards: number } {
  const text = (highDays || '').trim()
  if (!text || text === '首板') {
    return { limit_up_days: 1, m_days_n_boards_days: 1, m_days_n_boards_boards: 1 }
  }
  const matched = text.match(/(\d+)\s*天\s*(\d+)\s*板/)
  if (matched) {
    const days = Number(matched[1]) || 1
    const boards = Number(matched[2]) || 1
    return { limit_up_days: boards, m_days_n_boards_days: days, m_days_n_boards_boards: boards }
  }
  const boardOnly = text.match(/(\d+)\s*板/)
  if (boardOnly) {
    const boards = Number(boardOnly[1]) || 1
    return { limit_up_days: boards, m_days_n_boards_days: boards, m_days_n_boards_boards: boards }
  }
  return { limit_up_days: 1, m_days_n_boards_days: 1, m_days_n_boards_boards: 1 }
}

function toUnixSeconds(value: string | number | undefined | null): number {
  if (value == null || value === '') return 0
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

/** 同花顺条目 → StockPool 文档字段 */
export function mapThsItemToStockPool(item: ThsLimitUpPoolItem, date = timer.today()): IStockPool {
  const code = String(item.code || '').padStart(6, '0')
  const boards = parseHighDays(item.high_days)
  const reasonText = (item.reason_type || '').trim()
  const plates = reasonText
    ? reasonText
        .split('+')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((plate_name) => ({ plate_name }))
    : []

  return {
    code,
    name: item.name || '',
    type: 'zt',
    first_limit_up: toUnixSeconds(item.first_limit_up_time),
    last_limit_up: toUnixSeconds(item.last_limit_up_time),
    break_limit_up_times: item.open_num == null ? 0 : Number(item.open_num) || 0,
    limit_up_days: boards.limit_up_days,
    m_days_n_boards_days: boards.m_days_n_boards_days,
    m_days_n_boards_boards: boards.m_days_n_boards_boards,
    // 同花顺为百分比，入库用选股宝同款小数比例
    turnover_ratio: item.turnover_rate != null ? Number(item.turnover_rate) / 100 : 0,
    change_percent: item.change_rate != null ? Number(item.change_rate) / 100 : 0,
    price: item.latest != null ? Number(item.latest) : 0,
    non_restricted_capital: item.currency_value != null ? Number(item.currency_value) : 0,
    is_new_stock: Boolean(item.is_new),
    surge_reason: {
      symbol: code,
      stock_reason: reasonText,
      related_plates: plates,
    },
    date,
    createdAt: new Date(),
  } as IStockPool
}

/** 同花顺涨停池 → StockPool.type=zt */
export class 涨停池 extends DataWorker<IStockPool> {
  protected socketDataName = '股票池' as SocketDataType
  protected model = StockPool
  protected upsert = true

  protected emitFields: Array<keyof IStockPool> = [
    'code',
    'name',
    'type',
    'first_limit_up',
    'last_limit_up',
    'limit_up_days',
    'turnover_ratio',
    'surge_reason',
    'date',
    'createdAt',
    'updatedAt',
  ]

  async get(params: Record<string, any> = {}) {
    const date = (params.date as string) || timer.today()
    const res = await fetchLimitUpPool({ date, limit: Number(params.limit) || 200 })
    const list = ensureArray(res.data?.info)

    await this.model.deleteMany({ date, type: 'zt' })

    return list.map((item) => mapThsItemToStockPool(item, date))
  }
}

async function runProbe() {
  const res = await fetchLimitUpPool({ limit: 5 })
  const list = res.data?.info ?? []
  const total = res.data?.page?.total ?? list.length
  const ztNum = res.data?.limit_up_count?.today?.num

  console.log(`[ths] date=${res.data?.date} trade=${res.data?.trade_status?.name ?? '-'} total=${total} ztNum=${ztNum ?? '-'}`)
  for (const item of list) {
    const mapped = mapThsItemToStockPool(item)
    console.log(
      `  ${mapped.code} ${mapped.name} ${item.high_days ?? ''} 连板=${mapped.limit_up_days} 涨幅=${item.change_rate ?? '-'}% 换手=${mapped.turnover_ratio} 原因=${item.reason_type ?? '-'}`
    )
  }
}

async function runWork() {
  const data = await new 涨停池().work()
  const list = Array.isArray(data) ? data : []
  console.log(`[ths] 入库完成 count=${list.length}`)
}

// 本地探测：pnpm --filter @awamstock/db run probe:ths-limit-up:ts
// 本地入库：pnpm --filter @awamstock/db run ingest:ths-limit-up
if (require.main === module) {
  const mode = process.argv.includes('--work') ? 'work' : 'probe'
  ;(mode === 'work' ? runWork() : runProbe()).catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
}
