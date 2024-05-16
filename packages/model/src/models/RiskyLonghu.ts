import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  list: ['600231'],
  date: '20220706',
}

export type IRiskyLonghu = IDocument<typeof data>

export const {
  fullConfig: riskyLonghuConfig,
  map: riskyLonghuMap,
  strNameMap: riskyLonghuStrNameMap,
  schemaGetter: riskyLonghuSchemaGetter,
  oriDataKeys: riskyLonghuOriDataKeys,
  modelGetter: riskyLonghuGetter,
  schema: RiskyLonghuSchema,
  model: RiskyLonghu,
} = new ModelFactory<IRiskyLonghu>('riskyLonghu', data, {}, { index: [{ date: 1 }, { background: true, unique: true }] })

export default riskyLonghuGetter
