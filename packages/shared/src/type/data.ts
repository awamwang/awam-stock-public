import { Required } from 'ts-toolbelt/out/Object/Required'
import { Merge } from 'ts-toolbelt/out/Object/Merge'
import { SortValues } from 'mongoose'

export type PlainDataModel<T = any> = Record<string, T> & Record<number, T>
export type PlainData = PlainDataModel | string | number
export type IStrNameMap<T extends PlainData = PlainData> = Partial<Record<keyof T, string>>

/**
 * 基础数据承载
 */
export interface IDataObject<T extends PlainData = PlainData> {
  data: Partial<T> | Partial<T>[] | null
  strNameMap?: IStrNameMap<T>
}
export interface IDataObjectSingle<T extends PlainData = PlainData> extends IDataObject<T> {
  data: T
}
export type IDataObjectSingleWithMap<T extends PlainData = PlainData> = Required<IDataObjectSingle<T>, 'strNameMap', 'flat'>
export interface IDataObjectList<T extends PlainData = PlainData> extends IDataObject<T> {
  data: T[]
}

/**
 * socket传送数据类型
 */
export type SocketDataType =
  | 'defaultDataWorker'
  | 'globalConfig'
  | 'lastTradeDate'
  | '大盘'
  | '板块涨跌'
  | '全球市场'
  | '短线精灵'
  | '大盘异动'
  | '市场消息'
  | '板块人气'
  | '板块人气个股'
  | '个股人气'
  | '股票池'
  | '涨停信息'
  | '竞价个股异动'

export interface ISocketData<T extends PlainData = PlainData> extends IDataObject<T> {
  name: SocketDataType
}
export interface ISocketDataSingle<T extends PlainData = PlainData> extends ISocketData<T> {
  data: T
}
export type ISocketDataSingleWithMap<T extends PlainData = PlainData> = Required<ISocketDataSingle<T>, 'strNameMap', 'flat'>
export interface ISocketDataList<T extends PlainData = PlainData> extends ISocketData<T> {
  data: T[]
}

export type SocketMessageType = 'global_notify' | 'global_status'
export interface ISocketMessage {
  type: SocketMessageType
  code?: number
  data: PlainData
}

/**
 * 接口请求参数
 */
export type SortOptions<T> = string | { [key in keyof T]: SortValues }

export const DefaultRequestQuery = {
  _sort: { date: -1, createdAt: -1 },
  _limit: Number.MAX_SAFE_INTEGER,
  _page: 1,
  _start: '',
  _end: '',
  _fields: '',
  _aggregate: '',
  _groupFirst: '',
  _noStrNameMap: false,
}
export const REQUEST_BUILDIN_QUERYS = Object.keys(DefaultRequestQuery)
export type IRequestBuildInQuery<T extends PlainDataModel = PlainDataModel> = Merge<
  Partial<typeof DefaultRequestQuery>,
  {
    _sort?: SortOptions<T>
    _noStrNameMap?: boolean | number
  }
>
export type IRequestQuery<T extends PlainDataModel> = Partial<T> & IRequestBuildInQuery<T>

/**
 * 接口返回的数据类型
 */
export interface ISuccessResponse<T extends PlainData = PlainData> extends IDataObject<T> {
  code: number
  msg?: string
}
export interface ISuccessResponseSingle<T extends PlainData = PlainData> extends ISuccessResponse<T> {
  data: T
}
export type ISuccessResponseSingleWithMap<T extends PlainData = PlainData> = Required<ISuccessResponseSingle<T>, 'strNameMap', 'flat'>
export interface ISuccessResponseList<T extends PlainData = PlainData> extends ISuccessResponse<T> {
  data: T[]
}
export interface IFailedResponse {
  code: number
  error?: string
  detail?: string
}
