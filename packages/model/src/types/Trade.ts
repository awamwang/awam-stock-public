import { OTHER } from '@awamstock/shared/global'

const TradeTimes = ['开盘', '尾盘', '横盘', '挂单', '速涨', '速跌', '高频', OTHER] as const
const TradeInTypes = [...TradeTimes, '打板', '拉板', '抄底'] as const
const TradeOutTypes = [...TradeTimes, '板上', '拉板', '开盘'] as const

export type TradeTime = typeof TradeTimes[number]
export type TradeInType = typeof TradeInTypes[number]
export type TradeOutType = typeof TradeOutTypes[number]
