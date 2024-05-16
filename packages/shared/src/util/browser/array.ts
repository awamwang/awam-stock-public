import { isArray } from 'lodash'

export function ensureArray<T = any>(arr: any, defaultValue = []): T[] {
  return isArray(arr) ? arr : defaultValue
}
