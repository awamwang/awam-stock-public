import _ from 'lodash'
import { Object as ObjectType } from 'ts-toolbelt'

interface ObjCallback<T extends ObjectType.Object = ObjectType.Object> {
  (key: keyof T, value?: any): any
}

interface MapOptions {
  saveExtra?: boolean
}

export function mapObjBy<T extends ObjectType.Object = ObjectType.Object>(obj: T, callback: ObjCallback<T>): Record<keyof T, any> {
  return Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      [key]: callback(key, obj[key]),
    }),
    {}
  ) as Record<keyof T, any>
}

export function mapObjByMap<T extends ObjectType.Object = ObjectType.Object>(obj: T, map: Partial<Record<keyof T, unknown>>, options: MapOptions = {}): Record<keyof T, unknown> {
  const res: any = {}
  const { saveExtra = true } = options

  for (const key in obj) {
    if (map[key]) {
      res[map[key]] = obj[key]
    } else if (saveExtra) {
      res[key] = obj[key]
    }
  }

  return res
}

export function mapObj<T extends ObjectType.Object = ObjectType.Object>(
  obj: T,
  by: Partial<Record<keyof T, string>> | ObjCallback<T>,
  options: MapOptions = {}
): Record<keyof T, any> {
  if (typeof by === 'function') {
    return mapObjBy<T>(obj, by as ObjCallback<T>)
  } else {
    return mapObjByMap<T>(obj, by, options)
  }
}

export const cnUnitMap = {
  万: 10000,
  亿: 10000 * 10000,
  万亿: 10000 * 10000 * 10000,
}
export const NotNumberRegex = /[^\d.+\-e]/g
export const NumberUnitRegex = /([万亿]+)/

export function extractNumber(input: any) {
  const numberStr = String(input).trim().replace(NotNumberRegex, '')
  return _.toNumber(numberStr)
}
// console.log(extractNumber('+100.1%'))
// console.log(extractNumber('-1.7976931348623157e+308万'))

// const numbeRegex = /^([-+\d\\,\\.]+)([万|亿])?$/
// const numbeRegex = /^(.+)([万亿])?$/
export function parseStrNumber(input: any, unit?: string) {
  const num = extractNumber(input)
  if (!unit) {
    const [, parsedUnit] = String(input).match(NumberUnitRegex) || []
    unit = parsedUnit
  }

  if (isNaN(num)) return 0

  return num * (cnUnitMap[unit as keyof typeof cnUnitMap] || 1)
}
// console.log(parseStrNumber('-1,486.21万')) // -14862100
// console.log(parseStrNumber('-2万亿')) // -2000000000000
// console.log(parseStrNumber('-1.7976931348623157e+38万')) // -1.7976931348623156e+42

const cnUnitList = ['', ...Object.keys(cnUnitMap)] as const
export type cnUnit = typeof cnUnitList[number]
/**
 * 100000000 -> 1.00亿, 18282200 -> 1828.22万
 * @param num
 * @returns
 */
export function numberToCn(
  num?: number | string,
  options: {
    fixed?: number
    maxUnit?: cnUnit
  } = {}
): string {
  const { fixed = 2, maxUnit } = options

  if (!['string', 'number'].includes(typeof num)) return ''

  num = _.toNumber(num)
  const flag = num < 0 ? '-' : ''
  num = Math.abs(num)

  let i = 0
  while (num >= 10000 && cnUnitList[i] != maxUnit && i < cnUnitList.length - 1) {
    num = num / 10000
    i++
  }

  return `${flag}${num.toFixed(fixed)}${cnUnitList[i]}`
}

export function numberToIntCn(
  num?: number | string,
  options: {
    maxUnit?: cnUnit
  } = {}
): string {
  const { maxUnit } = options

  return numberToCn(num, {
    fixed: 0,
    maxUnit,
  })
}

export function toFixed(num: any, fixed = 2) {
  return _.toNumber(num).toFixed(fixed)
}

export function toInt(num: any) {
  return toFixed(num, 0)
}
