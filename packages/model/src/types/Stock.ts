import { OTHER } from '@awamstock/shared/global'

export const StockFeatures = ['趋势', '波段', '庄股', '股性差', '连板', '一字', '新股', '人气', OTHER] as const
export type StockFeature = typeof StockFeatures[number]
