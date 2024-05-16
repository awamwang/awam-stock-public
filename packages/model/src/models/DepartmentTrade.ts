import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  code: '002770',
  name: '科迪退',
  c: '0.66',
  r: '-72.15',
  department: '中原证券股份有限公司商丘分公司',
  d_type: '--',
  d_sort: 2,
  buy: 2452,
  buy_rate: 0,
  sell: 2180300,
  sell_rate: 1.8,
  net: -2177900,
  desc: '卖出金额最大前5名',
  reason: '退市整理证券',
  date: '20220704',
}

export type IDepartmentTrade = IDocument<typeof data, 'd_type', null>

export const {
  fullConfig: departmentTradeConfig,
  map: departmentTradeMap,
  strNameMap: departmentTradeStrNameMap,
  oriDataKeys: departmentTradeOriDataKeys,
  schemaGetter: departmentTradeSchemaGetter,
  modelGetter: departmentTradeGetter,
  schema: DepartmentTradeSchema,
  model: DepartmentTrade,
} = new ModelFactory<IDepartmentTrade>(
  'departmentTrade',
  data,
  {
    code: { oriName: '股票代码' },
    name: { oriName: '股票简称' },
    c: { oriName: '现价(元)' },
    r: { oriName: '涨跌幅(%)' },
    department: { oriName: '营业部名称' },
    d_type: { required: false, oriName: '营业部类型' },
    d_sort: { oriName: '营业部排名' },
    buy: { oriName: '营业部买入金额(元)' },
    buy_rate: { oriName: '营业部买入占比(%)' },
    sell: { oriName: '营业部卖出金额(元)' },
    sell_rate: { oriName: '营业部卖出占比(%)' },
    net: { oriName: '营业部净额(元)' },
    desc: { oriName: '营业部买卖方向' },
    reason: { oriName: '上榜原因' },
    date: { oriName: '上榜日期' },
  },
  {
    index: [
      { code: 1, department: 1, date: 1, net: 1 },
      { name: '_unique_index', background: true, unique: true },
    ],
  }
)

export default departmentTradeGetter
