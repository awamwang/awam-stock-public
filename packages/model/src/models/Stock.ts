import { IStockPool } from './StockPool'
import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'
import { StockFeature } from '../types/Stock'
export * from '../types/Stock'

const data = {
  code: '000016',
  symbol: '002770.SZ', // 暂不启用
  name: '深康佳A',
  area: '深圳', //
  exchange: 'SZSE',
  fullname: '康佳集团股份有限公司',
  market: '主板',
  industry: '家用电器',
  is_hs: 'S', // 是否沪深港通标的，N否 H沪股通 S深股通
  list_date: '19920327',
  delist_date: '19920327',
  list_status: 'L', // 	上市状态 L上市 D退市 P暂停上市
  feature: '趋势',
  myBlocks: ['我的板块'],
}

export type IStock = IDocument<
  typeof data,
  'delist_date' | 'feature' | 'myBlocks',
  {
    feature: StockFeature
  }
>

export type IDingPanStock = {
  score: number
  risky: boolean
  stock_pools?: IStockPool[]
} & IStock

export const {
  fullConfig: stockConfig,
  map: stockMap,
  strNameMap: stockStrNameMap,
  oriDataKeys: oriStockKeys,
  schemaGetter: stockSchemaGetter,
  modelGetter: stockGetter,
  schema: StockSchema,
  model: Stock,
} = new ModelFactory<IStock>(
  'stock',
  data,
  {
    code: { oriName: 'symbol' },
    symbol: { oriName: 'ts_code' },
    delist_date: { required: false },
    feature: { required: false },
    myBlocks: { required: false },
  },
  {
    index: [{ code: 1 }, { background: true, unique: true }],
  }
)

export default stockGetter
