import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

// from xuangubao
const data = {
  id: '972574',
  title: '哈尔斯：控股股东吕强先生拟通过协议转让的方式向龚文华先生、魏迪波女士分别转让2100万股、2800万股股份，合计占公司总股本的11.85%，转让价款共计2.87亿元',
  summary: '',
  content: '',
  stocks: ['002615'],
  image: '',
  subj_ids: ['723', '9', '451'],
  blocks: [
    {
      Id: '16920249',
      Name: '股权转让',
    },
  ],
  time: 1658729559,
  // ExplainInfos: null,
  // ExplainedInfos: null,
  // NeedExplained: false,
  // Impact: 0,
  // SubscribeType: 0,
  // IsSubscribed: false,
  // SubscribeSubjectId: '0',
  // TitlePath: '',
  // SummaryPath: '',
  // TitleHlts: null,
  // SummaryHlts: null,
  // IsWithdrawn: false,
  // Watermarks: '',
  // SubTitle: '',
  // WhetherHideImpactFace: false,
  // HasSummary: false,
  // FlashMarketMessageType: '',
  // SuperVipRightType: 0,
}

export type IMarketMessage = IDocument<typeof data, 'stocks', null>

export const {
  fullConfig: marketMessageConfig,
  map: marketMessageMap,
  strNameMap: marketMessageStrNameMap,
  schemaGetter: marketMessageSchemaGetter,
  modelGetter: marketMessageGetter,
  schema: MarketMessageSchema,
  model: MarketMessage,
} = new ModelFactory<IMarketMessage>(
  'marketMessage',
  data,
  {
    id: { oriName: 'Id' },
    title: { oriName: 'Title' },
    summary: { oriName: 'Summary' },
    content: { oriName: 'Content' },
    stocks: { oriName: 'AllStocks', required: false },
    image: { oriName: 'Image' },
    subj_ids: { oriName: 'SubjIds' },
    blocks: { oriName: 'BkjInfoArr' },
    time: { oriName: 'CreatedAtInSec' },
  },
  {
    index: [{ id: 1 }, { background: true, unique: true }],
  }
)

export default marketMessageGetter
