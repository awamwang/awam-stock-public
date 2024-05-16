import { BlockFrom, BlockType, BlockView, BlockFeature, IBlockLink, BlockTag } from '../types/Block'
export * from '../types/Block'

import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  name: '精选指数',
  code: '精选指数',
  alias: '别名',
  codeList: ['399001', '399005', '399006', '399106', '399300', '399903', '999999'],
  from: 'tdx',
  type: 'zs',
  view: '龙头',
  status: '正常',
  feature: '非连板',
  stockCount: 7,
  link: {
    tdx: '247248',
  },
  tags: ['hidden'],
}

export type IBlock = IDocument<
  typeof data,
  'feature' | 'status' | 'view' | 'link' | 'tags',
  {
    from: BlockFrom
    type: BlockType
    view: BlockView
    feature: BlockFeature
    link: IBlockLink
    tags: BlockTag[]
  }
>

export const {
  fullConfig: blockConfig,
  map: blockMap,
  strNameMap: blockStrNameMap,
  oriDataKeys: blockOriDataKeys,
  schemaGetter: blockSchemaGetter,
  modelGetter: blockGetter,
  schema: BlockSchema,
  model: Block,
} = new ModelFactory<IBlock>(
  'block',
  data,
  { alias: { required: false }, feature: { required: false } },
  {
    index: [{ code: 1 }, { background: true, unique: true }],
  }
)

export default blockGetter
