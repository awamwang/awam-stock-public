import { ModelFactory } from '../util'
import { IDocument } from './BaseModel'

const data = {
  date: '19901219',
  exchange: 'SSE', // 交易所
  open: 1,
  pre_date: '19901219',
}

export type ITradeCalendar = IDocument<typeof data>

export const {
  fullConfig: tradeCalendarConfig,
  map: tradeCalendarMap,
  strNameMap: tradeCalendarStrNameMap,
  oriDataKeys: oriTradeCalendarKeys,
  schemaGetter: tradeCalendarSchemaGetter,
  modelGetter: tradeCalendarGetter,
  schema: TradeCalendarSchema,
  model: TradeCalendar,
} = new ModelFactory<ITradeCalendar>(
  'tradeCalendar',
  data,
  {
    date: { oriName: 'cal_date' },
    open: { oriName: 'is_open' },
    pre_date: { oriName: 'pretrade_date' },
  },
  {
    index: [{ date: 1 }, { background: true, unique: true }],
  }
)

export default tradeCalendarGetter
