import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  code: '002591',
  name: '恒大高新',
  type: 0,
  money_type: '游资',
  r_max: 10,
  zt_to_buy: 29054025,
  m: 38029810,
  lb_target: '5连板',
  lb: 4,
  block_names: '绿色电力、智能电网',
  lt: 1558597286,
  gn: '绿色电力',
  r: 5.33333,
  m_net: 378418,
  hs: 2.55,
}

export type IBeforeOpenStock = IDocument<typeof data>

export const {
  fullConfig: beforeOpenStockConfig,
  map: beforeOpenStockMap,
  strNameMap: beforeOpenStockStrNameMap,
  oriDataKeys: beforeOpenStockOriDataKeys,
  schemaGetter: beforeOpenStockSchemaGetter,
  modelGetter: beforeOpenStockGetter,
  schema: BeforeOpenStockSchema,
  model: BeforeOpenStock,
} = new ModelFactory<IBeforeOpenStock>(
  'beforeOpenStock',
  data,
  {
    code: { oriName: 0 },
    name: { oriName: 1 },
    type: { oriName: 2 },
    money_type: { oriName: 3 },
    r_max: { oriName: 4 },
    zt_to_buy: { oriName: 6 },
    m: { oriName: 8 },
    lb_target: { oriName: 9 },
    lb: { oriName: 10 },
    block_names: { oriName: 11 },
    lt: { oriName: 15 },
    gn: { oriName: 16 },
    r: { oriName: 19 },
    m_net: { oriName: 20 },
    hs: { oriName: 21 },
  },
  {
    index: [
      { code: 1, date: 1 },
      { name: '_unique_index', background: true, unique: true },
    ],
  }
)

export default beforeOpenStockGetter
