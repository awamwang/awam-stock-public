import { App } from 'vue'
import { numberToCn, numberToIntCn, toFixed, toInt, normalizeDate, extractNumber, getNormalizeTimePartFromMillisecond, _ } from '@awamstock/shared/browser'

export const $formatters = {
  numberToCn(value: number | string | boolean | object | undefined, fixed = 2) {
    if (_.isUndefined(value)) {
      value = 0
    }

    return numberToCn(Number(value), { fixed })
  },
  numberToIntCn(value: number | string) {
    return numberToIntCn(value, { maxUnit: '亿' })
  },
  toFixed,
  toFixedPercent(value: number | string | boolean | object, digits = 2) {
    return toFixed(value, digits) + '%'
  },
  toInt,
  toIntNumber: (val: any) => Number(toInt(val)),
  normalizeDate,
  extractNumber,
  getNormalizeTimePartFromMillisecond,
}

export type IVueFormatters = typeof $formatters

export default function registerFilters(app: App) {
  app.config.globalProperties.$formatters = $formatters
}
