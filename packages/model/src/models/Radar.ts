import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'
import { RadarType } from '../types/Radar'
export * from '../types/Radar'

const data = {
  type: '封涨大减',
  name: '宝塔实业',
  code: '000595',
  plate_type: 1, // 板块类型
  r: '',
  content: '涨停封单大幅减少1585万元，剩余封单9558万元',
  content2: '剩余封单9558万',
  lb: '8连板',
  time: 1654153017,
  date: '20220602',
}

export type IRadar = IDocument<
  typeof data,
  'r' | 'content2' | 'lb',
  {
    type: RadarType
  }
>

export const {
  fullConfig: radarConfig,
  map: radarMap,
  strNameMap: radarStrNameMap,
  schemaGetter: radarSchemaGetter,
  modelGetter: radarGetter,
  schema: RadarSchema,
  model: Radar,
} = new ModelFactory<IRadar>(
  'radar',
  data,
  {
    type: { oriName: 'status' },
    name: { oriName: 'stock_name' },
    code: { oriName: 'stockid' },
    r: { required: false, oriName: 'zf' },
    content2: { required: false },
    lb: { required: false, oriName: 'LBstatus' },
  },
  {
    index: [
      { time: 1, code: 1, type: 1 },
      { name: '_unique_index', background: true, unique: true },
    ],
  }
)

export default radarGetter
