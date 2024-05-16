import _ from 'lodash'

import { mapObj } from './browser/lang'

export interface ITushareData {
  fields: string[]
  items: any[]
  has_more: boolean
}

export interface ITushareResponse {
  code: number
  data: ITushareData
  msg: string
  request_id: string
}

/**
 * tushare.pro返回特定结构
 * {fields: [], items: [], has_more: false}
 * @param resp
 * @param map
 * @returns
 */
export function parseTushareData(resp: ITushareResponse, map?: Partial<Record<string, string>>): any[] {
  const items = resp.data.items

  return items.map((item: []) => {
    return map ? mapObj(_.zipObject(resp.data.fields, item), map) : _.zipObject(resp.data.fields, item)
  })
}
