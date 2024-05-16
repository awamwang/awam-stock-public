import { IBlock } from '@awamstock/model'
import { list, IRequestQuery } from './api/index'

export async function blocks(params?: IRequestQuery<IBlock>) {
  return list<IBlock>('blocks', params)
}
