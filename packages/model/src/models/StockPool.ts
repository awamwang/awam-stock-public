import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'
import { StockPoolType } from '../types/StockPool'
export type { StockPoolType }

const data = {
  code: '',
  name: '长虹华意',
  type: 'zt',
  break_limit_down_times: 0,
  break_limit_up_times: 0,
  buy_lock_volume_ratio: 0,
  change_percent: -0.0998650472,
  first_break_limit_down: 0,
  first_break_limit_up: 0,
  first_limit_down: 1657867425,
  first_limit_up: 0,
  is_new_stock: false,
  issue_price: 4.08,
  last_break_limit_down: 0,
  last_break_limit_up: 0,
  last_limit_down: 1657867425,
  last_limit_up: 0,
  limit_down_days: 1,
  limit_timeline: {
    items: [
      {
        timestamp: 1657867425,
        status: 3,
      },
    ],
  },
  limit_up_days: 0,
  listed_date: 835113600,
  m_days_n_boards_boards: 4,
  m_days_n_boards_days: 6,
  mtm: 0,
  nearly_new_acc_pcp: 0,
  nearly_new_break_days: 0,
  new_stock_acc_pcp: 0.6348039216,
  new_stock_break_limit_up: 0,
  new_stock_limit_up_days: 0,
  new_stock_limit_up_price_before_broken: 0,
  non_restricted_capital: 4640764369.24,
  price: 6.67,
  sell_lock_volume_ratio: 0.006681233,
  stock_type: 0,
  surge_reason: {
    symbol: '000404.SZ',
    stock_reason:
      '1、冰箱冰柜压缩机行业龙头企业，全球市场份额超过20%；\n2、公司高端激光导航平台用于扫地机器人产品，控股子公司格兰博主营产品是智能家居清洁机器人；\n3、上半年净利润同比预增45.32%-65.79%',
    related_plates: [
      {
        plate_name: '家电',
      },
      {
        plate_name: '机器人',
      },
      {
        plate_name: '业绩预增',
        plate_reason: '一季报预披露高峰期，超年报表现个股受市场关注',
      },
    ],
  },
  total_capital: 4642293179.93,
  turnover_ratio: 0.2761735724,
  volume_bias_ratio: 1.6050868549,
  yesterday_break_limit_up_times: 0,
  yesterday_first_limit_up: 0,
  yesterday_last_limit_up: 0,
  yesterday_limit_down_days: 0,
  yesterday_limit_up_days: 0,
}

export type IStockPool = IDocument<
  typeof data,
  '',
  {
    type: StockPoolType
  }
>

export const {
  fullConfig: stockPoolConfig,
  map: stockPoolMap,
  strNameMap: stockPoolStrNameMap,
  oriDataKeys: oriStockPoolDataKeys,
  schemaGetter: stockPoolSchemaGetter,
  modelGetter: stockPoolGetter,
  schema: StockPoolSchema,
  model: StockPool,
} = new ModelFactory<IStockPool>(
  'stockPool',
  data,
  {
    code: { oriName: 'symbol' },
    name: { oriName: 'stock_chi_name' },
  },
  {
    index: [
      { code: 1, type: 1, date: 1 },
      { name: '_unique_index', background: true, unique: true },
    ],
  }
)

export default stockPoolGetter
