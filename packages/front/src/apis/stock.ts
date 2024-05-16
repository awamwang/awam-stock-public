import { IStock, IDingPanStock } from '@awamstock/model'
import { list, IRequestQuery } from './api/index'

export async function dingPanList(params?: IRequestQuery<IDingPanStock>) {
  return list<IDingPanStock>('stocks/ding-pan', params)
}

export async function dingPan(params?: IRequestQuery<IStock>) {
  const resp = await list<IStock>('stocks/ding-pan', params)

  return resp.data[0]
}
