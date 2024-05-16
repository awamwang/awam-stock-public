import { Expression, PipelineStage } from '../mongoose'

import { COLLECTIONS } from '../collections'
import { IDingPanStock } from '../models/index'
import { stockPoolQuery, StockPoolPipelineOptions } from './stockPool'
import { PipelineProp, PipelineGetterOptions } from '../types/query'

const basicProject = {
  _id: 0.0,
  code: 1,
  name: 1,
  industry: 1,
  score: 1,
} as Record<keyof IDingPanStock, number>

const safeScorePipeline = [
  {
    $lookup: {
      from: COLLECTIONS.safeScore,
      localField: 'code',
      foreignField: 'code',
      as: 'safe_score',
      pipeline: [{ $sort: { date: -1 } }, { $limit: 1 }],
    },
  },
  {
    $unwind: {
      path: '$safe_score',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          '$safe_score',
          {
            industry: '$industry',
          },
        ],
      },
    },
  },
]

interface IDingPanQueryOptions extends PipelineGetterOptions {
  noSafeScore?: boolean
  noStockPool?: boolean
  stockPoolMatches?: Record<string, Expression>
  stockPoolOptions?: StockPoolPipelineOptions
}

export function dingPanQuery(match: PipelineProp<IDingPanStock>, options: IDingPanQueryOptions): PipelineStage[] {
  const { noSafeScore = false, noStockPool = false, stockPoolMatches = {}, stockPoolOptions, project } = options

  return [
    {
      $match: match,
    },
    // 添加safeScore信息
    ...((noSafeScore ? [] : safeScorePipeline) as PipelineStage[]),
    // 添加stockPool
    ...((noStockPool
      ? []
      : [
          {
            $lookup: {
              from: COLLECTIONS.stockPool,
              localField: 'code',
              foreignField: 'code',
              pipeline: stockPoolQuery(
                {
                  ...match,
                  ...stockPoolMatches,
                },
                stockPoolOptions
              ),
              as: 'stock_pools',
            },
          },
        ]) as PipelineStage[]),
    {
      $project: {
        ...basicProject,
        ...(noStockPool ? {} : { stock_pools: 1 }),
        ...project,
      },
    },
  ]
}
