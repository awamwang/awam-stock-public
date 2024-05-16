import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  list: [],
  time: 1658383920,
}

export type IMoodList = IDocument<typeof data>

export const {
  fullConfig: moodListConfig,
  map: moodListMap,
  strNameMap: moodListStrNameMap,
  schemaGetter: moodListSchemaGetter,
  modelGetter: moodListGetter,
  schema: MoodListSchema,
  model: MoodList,
} = new ModelFactory<IMoodList>('moodList', data, {})

export default moodListGetter
