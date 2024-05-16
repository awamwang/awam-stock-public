import { PipelineStage } from '../mongoose'

import { PipelineGetter } from '../types/query'

export const groupFirst: PipelineGetter = function groupFirst(matchs, options = {}): PipelineStage[] {
  const { groupFirstBy, project, sort } = options

  return [
    {
      $match: matchs,
    },
    ...(sort ? [{ $sort: sort }] : []),
    {
      $group: {
        _id: `$${groupFirstBy}`,
        record: {
          $first: '$$ROOT',
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ['$record'],
        },
      },
    },
    ...(project ? [{ $project: project }] : []),
  ]
}
