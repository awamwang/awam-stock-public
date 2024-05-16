import { Schema } from '../mongoose'

import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  type: 'lastTradeDate',
  value: '20220706',
  desc: '',
  comments: ['最后交易日'],
}

export type IGlobalConfig = IDocument<
  typeof data,
  'comments',
  {
    value: string | number
  }
>

export const {
  fullConfig: globalConfigConfig,
  map: globalConfigMap,
  strNameMap: globalConfigStrNameMap,
  schemaGetter: globalConfigSchemaGetter,
  oriDataKeys: globalConfigOriDataKeys,
  modelGetter: globalConfigGetter,
  schema: GlobalConfigSchema,
  model: GlobalConfig,
} = new ModelFactory<IGlobalConfig>(
  'globalConfig',
  data,
  {
    value: { type: Schema.Types.Mixed },
    comments: { required: false },
  },
  {
    index: [{ type: 1 }, { background: true, unique: true }],
  }
)

export default globalConfigGetter
