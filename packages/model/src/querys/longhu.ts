import { PipelineStage } from '../mongoose'

import { IDepartmentTrade } from '../models/index'
import { PipelineGetter, PipelineGetterOptions } from '../types/query'

const pipeline = [
  {
    $project: {
      _id: 0.0,
      code: 1.0,
      name: 1.0,
      department: 1.0,
      net: 1.0,
      buy_rate: 1.0,
      sell_rate: 1.0,
      date: 1.0,
    } as Record<keyof IDepartmentTrade, number>,
  },
  {
    $group: {
      _id: '$department',
      net: {
        $sum: '$net',
      },
      buy_rate: {
        $max: '$buy_rate',
      },
      sell_rate: {
        $max: '$sell_rate',
      },
      record: {
        $first: '$$ROOT',
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          '$record',
          {
            net: '$net',
          },
          {
            buy_rate: '$buy_rate',
          },
          {
            sell_rate: '$sell_rate',
          },
        ],
      },
    },
  },
]

export const longhuQuery: PipelineGetter = function longhuQuery(matchs, options = {}) {
  const { project } = options

  return [
    {
      $match: matchs,
    },
    ...pipeline,
    ...(project ? [{ $project: project }] : []),
  ]
}
