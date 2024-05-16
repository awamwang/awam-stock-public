export const stockPoolTypeMap = {
  zt: '涨停',
  dt: '跌停',
  zt_broken: '炸板',
  hot: '热门',
  zt_zr: '昨日涨停',
} as const

export type StockPoolType = keyof typeof stockPoolTypeMap
export type StockPoolTypeCn<K extends StockPoolType> = typeof stockPoolTypeMap[K]
