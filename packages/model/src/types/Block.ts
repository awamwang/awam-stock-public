import { OTHER } from '@awamstock/shared/global'

export const BlockFromList = ['tdx', 'ths', 'long-tou', 'em', 'custom'] as const // 通达信、同花顺、龙头、东方财富、自定义
export type BlockFrom = typeof BlockFromList[number]
export const BlockTypes = ['gn', 'zs', 'fg', 'dq', 'hy', 'qx'] as const // 概念、指数、风格、地区、行业、情绪
export type BlockType = typeof BlockTypes[number]
export type BlockView = '龙头' | typeof OTHER
export const BlockFeatures = ['趋势', '波段', '非连板', OTHER] as const
export type BlockFeature = typeof BlockFeatures[number]
export const BlockTags = ['hidden', OTHER] as const
export type BlockTag = typeof BlockTags[number]

export type IBlockLink = Record<BlockFrom, string>
