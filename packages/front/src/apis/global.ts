import {
  IGlobalConfig,
  ITradeCalendar,
  IEnvironment,
  IGlobalMarket,
  IRadar,
  IBeforeOpenStock,
  IStockPool,
  IMarketMessage,
  IYiDong,
  IFocusedDepartment,
  IBlockDay,
  IMoodBlockItem,
  IMoodBlockStock,
  IMoodStockItem,
} from '@awamstock/model'
import { list, getOne, get, IRequestQuery } from './api/index'
export { blocks } from './block'

export async function lastTradeDate() {
  return get<IGlobalConfig>('global-configs', 'lastTradeDate')
}

export async function tradeCalendars(params?: IRequestQuery<ITradeCalendar>) {
  return list<ITradeCalendar>('trade-calendars', params)
}

export async function environment(params?: IRequestQuery<IEnvironment>) {
  return getOne<IEnvironment>('environments', params)
}

export async function environments(params?: IRequestQuery<IEnvironment>) {
  return list<IEnvironment>('environments', params)
}

export async function globalMarket(params?: IRequestQuery<IGlobalMarket>) {
  return getOne<IGlobalMarket>('global-markets', params)
}

export async function globalMarkets(params?: IRequestQuery<IGlobalMarket>) {
  return list<IGlobalMarket>('global-markets', params)
}

export async function radar(params?: IRequestQuery<IRadar>) {
  return getOne<IRadar>('radars', params)
}

export async function radars(params?: IRequestQuery<IRadar>) {
  return list<IRadar>('radars', params)
}

export async function beforeOpenStocks(params?: IRequestQuery<IBeforeOpenStock>) {
  return list<IBeforeOpenStock>('before-open-stocks', params)
}

export async function stockPools(params?: IRequestQuery<IStockPool>) {
  return list<IStockPool>('stock-pools', params)
}

export async function marketMessages(params?: IRequestQuery<IMarketMessage>) {
  return list<IMarketMessage>('market-messages', params)
}

export async function yiDongs(params?: IRequestQuery<IYiDong>) {
  return list<IYiDong>('yi-dongs', params)
}

export async function focusedDepartments(params?: IRequestQuery<IFocusedDepartment>) {
  return list<IFocusedDepartment>('focused-departments', params)
}

export async function blockDays(params?: IRequestQuery<IBlockDay>) {
  return list<IBlockDay>('block-days', params)
}

export async function moodBlock(params?: IRequestQuery<IMoodBlockItem>) {
  return getOne<IMoodBlockItem>('mood-blocks', params)
}

export async function moodBlocks(params?: IRequestQuery<IMoodBlockItem>) {
  return list<IMoodBlockItem>('mood-blocks', params)
}

export async function moodBlockStock(params?: IRequestQuery<IMoodBlockStock>) {
  return getOne<IMoodBlockStock>('mood-block-stocks', params)
}

export async function moodBlockStocks(params?: IRequestQuery<IMoodBlockStock>) {
  return list<IMoodBlockStock>('mood-block-stocks', params)
}

export async function moodStock(params?: IRequestQuery<IMoodStockItem>) {
  return getOne<IMoodStockItem>('mood-stocks', params)
}

export async function moodStocks(params?: IRequestQuery<IMoodStockItem>) {
  return list<IMoodStockItem>('mood-stocks', params)
}
