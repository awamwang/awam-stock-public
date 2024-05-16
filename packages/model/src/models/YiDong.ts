import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  id: '972288',
  title: '商业百货板块震荡走低，永辉超市触及跌停，文峰股份、华联股份、欧亚集团跌超6%，深赛格、广百股份、三江购物等跌幅居前',
  type: -1,
  block: {
    Id: '17091954',
    Name: '新零售',
  },
  time: 1658729559,
}

export type IYiDong = IDocument<typeof data>

export const {
  fullConfig: yiDongConfig,
  map: yiDongMap,
  strNameMap: yiDongStrNameMap,
  schemaGetter: yiDongSchemaGetter,
  modelGetter: yiDongGetter,
  schema: YiDongSchema,
  model: YiDong,
} = new ModelFactory<IYiDong>(
  'yiDong',
  data,
  {
    id: { oriName: 'Id' },
    title: { oriName: 'Title' },
    type: { oriName: 'BkYiDongType' },
    block: { oriName: 'BkjInfo' },
    time: { oriName: 'CreatedAt' },
  },
  {
    index: [{ id: 1 }, { background: true, unique: true }],
  }
)

export default yiDongGetter
