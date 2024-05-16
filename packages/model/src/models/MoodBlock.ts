import { Schema } from '../mongoose'
import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  list: [],
  time: 1658383920,
}
const item = {
  code: '801199',
  name: '汽车零部件',
  power: 11961, // 人气
  r: 2.72, // 涨幅
  rs: 0.926, // 涨速
  m_net: 1669294400, // 主力净额
  sort: 1,
  time: 1658383920,
}

export type IMoodBlockItem = IDocument<typeof item, 'sort', null>
export type IMoodBlock = IDocument<
  typeof data,
  '',
  {
    list: IMoodBlockItem[]
  }
>

export const {
  fullConfig: moodBlockConfig,
  map: moodBlockMap,
  strNameMap: moodBlockStrNameMap,
  schemaGetter: moodBlockSchemaGetter,
  modelGetter: moodBlockGetter,
  schema: MoodBlockSchema,
  model: MoodBlock,
} = new ModelFactory<IMoodBlock>(
  'moodBlock',
  data,
  { list: { type: Schema.Types.Mixed } },
  {
    index: [{ time: 1 }, { background: true, unique: true }],
  }
)
export const {
  fullConfig: moodBlockItemConfig,
  map: moodBlockItemMap,
  strNameMap: moodBlockItemStrNameMap,
  schemaGetter: moodBlockItemSchemaGetter,
  modelGetter: moodBlockItemGetter,
  schema: MoodBlockItemSchema,
  model: MoodBlockItem,
} = new ModelFactory<IMoodBlockItem>(
  'moodBlockItem',
  item,
  {
    code: { oriName: '0' },
    name: { oriName: '1' },
    power: { oriName: '2' },
    r: { oriName: '3' },
    rs: { oriName: '4' },
    m_net: { oriName: '6' },
    sort: { required: false },
  },
  {
    index: [
      { code: 1, date: 1 },
      { name: '_unique_index', background: true, unique: true },
    ],
  }
)

export default moodBlockItemGetter
