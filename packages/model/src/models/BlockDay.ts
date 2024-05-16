import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

// from long-tou
const data = {
  code: 801900,
  zt: 32,
  dt: 0,
  // "11",
  // "1",
  // "27",
  // "1"
}

export type IBlockDay = IDocument<typeof data>

export const {
  fullConfig: blockDayConfig,
  map: blockDayMap,
  strNameMap: blockDayStrNameMap,
  schemaGetter: blockDaySchemaGetter,
  oriDataKeys: blockDayOriDataKeys,
  modelGetter: blockDayGetter,
  schema: BlockDaySchema,
  model: BlockDay,
} = new ModelFactory<IBlockDay>(
  'blockDay',
  data,
  {
    code: { oriName: 0 },
    zt: { oriName: 2 },
    dt: { oriName: 4 },
  },
  {
    index: [
      { code: 1, date: 1 },
      { name: '_unique_index', background: true, unique: true },
    ],
  }
)

export default blockDayGetter
