import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'
import { StockFeature } from './Stock'
import { DepartmentType } from '../types/FocusedDepartment'
import { TradeInType, TradeOutType } from '../types/Trade'

const data = {
  code: '000001',
  name: '华泰证券股份有限公司总部',
  alias: '华泰证券',
  type: '超短',
  comments: ['板上砸'],
  favor: ['趋势'], // 偏好
  in: ['打板'], // 入场时机
  out: ['开盘'], // 出场时机
  power: 1, // 影响度 1-10 // 后续从成交额和股价波动自动更新
  count: 2, // 命中次数
}

export type IFocusedDepartment = IDocument<
  typeof data,
  'code' | 'alias' | 'comments' | 'favor' | 'in' | 'out' | 'power' | 'count',
  {
    type: DepartmentType
    favor?: StockFeature[]
    in?: TradeInType[]
    out?: TradeOutType[]
  }
>

export const {
  oriData: focusedDepartmentOriData,
  fullConfig: focusedDepartmentConfig,
  map: focusedDepartmentMap,
  strNameMap: focusedDepartmentStrNameMap,
  schemaGetter: focusedDepartmentSchemaGetter,
  modelGetter: focusedDepartmentGetter,
  schema: FocusedDepartmentSchema,
  model: FocusedDepartment,
} = new ModelFactory<IFocusedDepartment>(
  'focusedDepartment',
  data,
  {
    code: { required: false },
    alias: { required: false },
    comments: { required: false },
    favor: { required: false },
    in: { required: false },
    out: { required: false },
    power: { required: false },
    count: { required: false },
  },
  {
    index: [
      { name: 1, type: 1 },
      { name: '_unique_index', background: true, unique: true },
    ],
  }
)

export default focusedDepartmentGetter
