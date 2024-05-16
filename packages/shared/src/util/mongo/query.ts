import _ from 'lodash'

import { PlainDataModel, IRequestQuery } from '../../type/index'

// 格式化时间
export function omitDateQuery(start: string, end: string): Record<string, unknown> | null {
  const dateQuery = _.omitBy({ $gte: start, $lte: end }, _.isNil)

  if (!Object.values(dateQuery).length) {
    return null
  }

  return dateQuery
}

function isUsefulValue(value: any): boolean {
  return _.isObject(value) ? !_.isEmpty(value) : !_.isNil(value)
}

export function omitQuery<T extends IRequestQuery<PlainDataModel> = IRequestQuery<PlainDataModel>>(query: T, acceptKeyList?: (keyof T)[]): T {
  return Object.keys(query).reduce((acc, key) => {
    if (acceptKeyList && !acceptKeyList.includes(key)) {
      return acc
    }

    const value = _.isObject(query[key]) ? omitQuery(query[key] as T) : query[key]

    return { ...acc, ...(isUsefulValue(value) ? { [key]: value } : {}) }
  }, {} as T)
}

// const a = omitQuery({
//   buy: { $gte: undefined },
//   code: '000899',
//   date: { $gte: '20220601' },
//   sell: { $gte: undefined },
// })
// console.log(a)
