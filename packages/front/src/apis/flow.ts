import { IDepartmentTrade } from '@awamstock/model'
import { list, IRequestQuery } from './api/index'

export async function longhus(params?: IRequestQuery<IDepartmentTrade>) {
  return list<IDepartmentTrade>('flows/longhu', params)
}
