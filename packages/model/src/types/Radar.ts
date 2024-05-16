import { OTHER } from '@awamstock/shared/global'

export const RadarTypes = [
  '昨日涨停表现',
  '开盘情绪',
  // 涨停
  '冲击涨停',
  '封死涨停',
  '封涨大减',
  '涨停被砸',
  '涨停回封',
  // 跌停
  '冲击跌停',
  '涨停打开',
  '封死跌停',
  '封跌大减',
  '跌停撬板',
  '跌停打开',
  '跌停回封',
  // 连板
  '连板打开',
  '连板预开',
  OTHER,
] as const
export type RadarType = typeof RadarTypes[number]
