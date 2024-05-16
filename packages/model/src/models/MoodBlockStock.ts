import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  code: '002411',
  name: '*ST必康',
  block_code: '864664',
  blocks: 'ST板块、电解液', // 人气
  r: 2.72, // 涨幅
  p: 9.04, // 涨速
  money_type: '游资', //
  m: 1669294400, // 总成交
  m_net: 1669294400, // 主力净额
  lb: '9天8板',
  pos: '龙一',
  hs: 6.07,
  time: 1658383920,
}

export type IMoodBlockStock = IDocument<typeof data>

export const {
  fullConfig: moodBlockStockConfig,
  map: moodBlockStockMap,
  strNameMap: moodBlockStockStrNameMap,
  schemaGetter: moodBlockStockSchemaGetter,
  oriDataKeys: moodBlockStockOriDataKeys,
  modelGetter: moodBlockStockGetter,
  schema: MoodBlockStockSchema,
  model: MoodBlockStock,
} = new ModelFactory<IMoodBlockStock>(
  'moodBlockStock',
  data,
  {
    code: { oriName: '0' },
    name: { oriName: '1' },
    money_type: { oriName: '2' },
    blocks: { oriName: '4' },
    p: { oriName: '5' },
    r: { oriName: '6' },
    m: { oriName: '7' },
    m_net: { oriName: '13' },
    lb: { oriName: '23' },
    pos: { oriName: '24' },
    hs: { oriName: '25' },
  },
  {
    index: [
      { code: 1, date: 1, block_code: 1 },
      { name: '_unique_index', background: true, unique: true },
    ],
  }
)

export default moodBlockStockGetter
