import _ from 'lodash'
import { get as lsGet, set as lsSet } from 'local-storage'

import { SortValues } from '../../type/util'
export type { SortValues } from '../../type/util'

export interface CompareGetterOptions {
  sort?: SortValues
  emptyValue?: SortValues // 如何处理空值比较
}
interface SortIteratee<T> {
  (v: T): any
}

function parseSortValue(sort: SortValues): number {
  if ([1, '1', 'ascending', 'asc'].includes(sort)) {
    return 1
  }
  if ([-1, '-1', 'descending', 'desc'].includes(sort)) {
    return -1
  }

  return sort as number
}

function parseSortIteratee<T>(sortIteratee: keyof T | SortIteratee<T> | null): SortIteratee<T> {
  if (!sortIteratee) {
    return (v) => v
  } else if (typeof sortIteratee === 'string') {
    return (v: T) => v && (v as Record<string, any>)[sortIteratee]
  } else {
    return sortIteratee as SortIteratee<T>
  }
}

export function getCompareFn<T>(
  compareFnOrSort: ((a: T, b: T) => number) | SortValues,
  sortIteratee?: keyof T | SortIteratee<T> | null,
  options: CompareGetterOptions = {}
): (a: T, b: T) => number {
  let myCompareFn: (a: any, b: any) => number
  if (typeof compareFnOrSort !== 'function') {
    myCompareFn = (a, b) => (a - b) * parseSortValue(compareFnOrSort)
  }

  const mySortIteratee = parseSortIteratee<T>(sortIteratee || null)

  const { sort = 1, emptyValue = 0 } = options
  const mySort = parseSortValue(sort)
  const myEmptyValue = parseSortValue(emptyValue)

  return (a: T, b: T) => {
    const aVal = mySortIteratee(a)
    const bVal = mySortIteratee(b)

    if (myEmptyValue && aVal !== bVal) {
      if (_.isNil(aVal)) {
        return myEmptyValue
      }
      if (_.isNil(bVal)) {
        return myEmptyValue * -1
      }
    }

    return myCompareFn(aVal, bVal) * mySort
  }
}

export interface ArraySortOptions<T> {
  sort?: SortValues | null
  prop?: keyof T | null
}

function useSavedArraySort<T>(key: string, options: ArraySortOptions<T> = {}) {
  const { sort, prop = '' } = options

  if (sort) {
    const savedOptions = {
      sort,
      prop,
    }

    lsSet(key, JSON.stringify(savedOptions))

    return savedOptions
  } else {
    if (sort === null && prop === null) {
      lsSet(key, '{}')
    }

    return JSON.parse(lsGet(key) || '{}')
  }
}

export interface PersistentSortOptions<T> extends CompareGetterOptions {
  key?: string
  compareFn?: ((a: T, b: T) => number) | SortValues
  sortIteratee?: keyof T | SortIteratee<T> | null
}

// 用key区分不同数据和storage；对传入的data，根据prop或者sortIteratee排序，调用getCompareFn
export const persistentSort = <T>(data: T[], options: PersistentSortOptions<T> = {}): ArraySortOptions<T> => {
  const { key = 'default_sort', sort, compareFn, sortIteratee } = options
  const prop = typeof sortIteratee === 'string' ? sortIteratee : null
  const sortOptions = useSavedArraySort<T>(key, { sort, prop })

  if (!sortOptions.sort || !sortOptions.prop) return sortOptions

  const myCompareFn = getCompareFn<T>(compareFn || sortOptions.sort, sortOptions.prop)
  data.sort(myCompareFn)

  return sortOptions
}
