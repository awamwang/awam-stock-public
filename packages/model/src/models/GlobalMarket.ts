import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  code: 'N225',
  name: '日经225',
  type: 4, // 0(证券), 1 , 2(连续指数) , 3(期货), 4(指数)
  v: 27457.89, // 指数值
  turnover: 0, // ?
  increase_rate: '0.65%', // 涨幅
  increase_amount: '178.09', // 增长值
  cn: 0,
  state: '0',
  date: '20220601',
}

export type IGlobalMarket = IDocument<typeof data, 'state', null>

export const {
  fullConfig: globalMarketConfig,
  map: globalMarketMap,
  strNameMap: globalMarketStrNameMap,
  schemaGetter: globalMarketSchemaGetter,
  oriDataKeys: globalMarketOriDataKeys,
  modelGetter: globalMarketGetter,
  schema: GlobalMarketSchema,
  model: GlobalMarket,
} = new ModelFactory<IGlobalMarket>('globalMarket', data, {
  name: { oriName: 'prod_name' },
  v: { oriName: 'last_px' },
  turnover: { required: false },
  state: { required: false },
})

export default globalMarketGetter
