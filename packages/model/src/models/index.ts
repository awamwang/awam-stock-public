import { Mongoose, Model } from '../mongoose'
export type { PlainDataModel } from '@awamstock/shared/type'

export type ModelGetter<T> = (mongoose: Mongoose) => Model<T>

export * from './GlobalConfig'

export * from './TradeCalendar'
export * from './Stock'
export * from './Block'
export * from './BlockDay'
export * from './StockPool'

export * from './MoodList'
export * from './MoodBlock'
export * from './MoodStock'
export * from './MoodBlockStock'

export * from './Environment'
export * from './GlobalMarket'
export * from './Radar'
export * from './MarketMessage'
export * from './YiDong'

export * from './BeforeOpenStock'

export * from './DepartmentTrade'
export * from './FocusedDepartment'
export * from './RiskyLonghu'

export * from './SafeScore'
