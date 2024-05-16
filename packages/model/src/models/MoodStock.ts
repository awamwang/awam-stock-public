import { Schema } from '../mongoose'
import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  list: [],
  time: 1658383920,
}
const item = {
  code: '002411',
  name: '*ST必康',
  r: 2.72, // 涨幅
  change: 4, // 排名变化
  sort: 1,
}

export type IMoodStockItem = IDocument<typeof item>
export type IMoodStock = IDocument<
  typeof data,
  '',
  {
    list: IMoodStockItem[]
  }
>

export const {
  fullConfig: moodStockConfig,
  map: moodStockMap,
  strNameMap: moodStockStrNameMap,
  schemaGetter: moodStockSchemaGetter,
  modelGetter: moodStockGetter,
  schema: MoodStockSchema,
  model: MoodStock,
} = new ModelFactory<IMoodStock>(
  'moodStock',
  data,
  {
    list: { type: Schema.Types.Mixed },
  },
  {
    index: [{ time: 1 }, { background: true, unique: true }],
  }
)
export const {
  fullConfig: moodStockItemConfig,
  map: moodStockItemMap,
  strNameMap: moodStockItemStrNameMap,
  schemaGetter: moodStockItemSchemaGetter,
  modelGetter: moodStockItemGetter,
  schema: MoodStockItemSchema,
  model: MoodStockItem,
} = new ModelFactory<IMoodStockItem>(
  'moodStockItem',
  item,
  {
    code: { oriName: '0' },
    name: { oriName: '1' },
    r: { oriName: '2' },
    change: { oriName: '3' },
    sort: { oriName: '4' },
  },
  {
    index: [
      { code: 1, date: 1 },
      { name: '_unique_index', background: true, unique: true },
    ],
  }
)

export default moodStockItemGetter
