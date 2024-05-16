import { groupFirst } from './groupFirst'
import { longhuQuery } from './longhu'
import { dingPanQuery } from './stock'
import { stockPoolQuery } from './stockPool'
export * from './groupFirst'
export * from './longhu'
export * from './stock'
export * from './stockPool'

export const QUERYS = {
  groupFirst,
  longhuQuery,
  dingPanQuery,
  stockPoolQuery,
}
export type QueryName = keyof typeof QUERYS

export default QUERYS
