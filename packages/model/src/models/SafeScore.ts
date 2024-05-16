import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  code: '600503',
  name: '科迪退',
  score: 71,
  date: '20220704',
  lastScore: 76,
  lastScoreDate: '20220704',
  level: '调低',
}

export type ISafeScore = IDocument<typeof data>

export const {
  fullConfig: safeScoreConfig,
  map: safeScoreMap,
  strNameMap: safeScoreStrNameMap,
  schemaGetter: safeScoreSchemaGetter,
  oriDataKeys: safeScoreOriDataKeys,
  modelGetter: safeScoreGetter,
  schema: SafeScoreSchema,
  model: SafeScore,
} = new ModelFactory<ISafeScore>(
  'safeScore',
  data,
  {
    code: { oriName: '代码' },
    name: { oriName: '名称' },
    score: { oriName: '最新_分数' },
    date: { oriName: '最新_日期' },
    lastScore: { oriName: '上次_分数' },
    lastScoreDate: { oriName: '上次_日期' },
    level: { oriName: '评级' },
  },
  {
    index: [
      { code: 1, date: 1 },
      { name: '_unique_index', background: true, unique: true },
    ],
  }
)

export default safeScoreGetter
