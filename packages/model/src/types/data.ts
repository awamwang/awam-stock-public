import { PlainData, ISocketDataList, ISocketDataSingle } from '@awamstock/shared/type'
import {
  IGlobalConfig,
  IBlockDay,
  IEnvironment,
  IGlobalMarket,
  IRadar,
  IYiDong,
  IMoodBlockItem,
  IMoodStockItem,
  IMarketMessage,
  IStockPool,
  IBeforeOpenStock,
  IMoodBlockStock,
} from '../models/index'

export interface IGlobalConfigSocketData extends ISocketDataSingle<IGlobalConfig> {
  name: 'globalConfig'
}

export interface ILastTradeDateSocketData extends ISocketDataSingle<IGlobalConfig> {
  name: 'lastTradeDate'
}

export interface IBlockDaySocketData extends ISocketDataList<IBlockDay> {
  name: '板块涨跌'
}

export interface IEnvironmentSocketData extends ISocketDataSingle<IEnvironment> {
  name: '大盘'
}

export interface IGlobalMarketSocketData extends ISocketDataList<IGlobalMarket> {
  name: '全球市场'
}

export interface IRadarSocketData extends ISocketDataList<IRadar> {
  name: '短线精灵'
}

export interface IYiDongSocketData extends ISocketDataList<IYiDong> {
  name: '大盘异动'
}

export interface IMarketMessageSocketData extends ISocketDataList<IMarketMessage> {
  name: '市场消息'
}

export interface IMoodBlockSocketData extends ISocketDataList<IMoodBlockItem> {
  name: '板块人气'
}

export interface IMoodBlockStockSocketData extends ISocketDataList<IMoodBlockStock> {
  name: '板块人气个股'
}

export interface IMoodStockSocketData extends ISocketDataList<IMoodStockItem> {
  name: '个股人气'
}

export interface IStockPoolSocketData extends ISocketDataList<IStockPool> {
  name: '股票池'
}

export interface IBeforeOpenStockSocketData extends ISocketDataList<IBeforeOpenStock> {
  name: '竞价个股异动'
}

export type ITypeSocketData =
  | IGlobalConfigSocketData
  | ILastTradeDateSocketData
  | IBlockDaySocketData
  | IEnvironmentSocketData
  | IGlobalMarketSocketData
  | IRadarSocketData
  | IYiDongSocketData
  | IMarketMessageSocketData
  | IMoodBlockSocketData
  | IMoodBlockStockSocketData
  | IMoodStockSocketData
  | IBeforeOpenStockSocketData
  | IStockPoolSocketData
