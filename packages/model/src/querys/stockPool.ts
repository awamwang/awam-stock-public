import { PipelineStage } from '../mongoose'

import { IStockPool } from '../models/index'
import { PipelineProp, PipelineGetterOptions, PipelineProejct } from '../types/query'

const basicProject: PipelineProejct<IStockPool> = {
  _id: 0,
  code: 1,
  type: 1,
  stock_type: 1,
  first_limit_up: 1,
  last_break_limit_up: 1,
  break_limit_up_times: 1,
  first_break_limit_up: 1,
  yesterday_first_limit_up: 1,
  yesterday_last_limit_up: 1,
  yesterday_break_limit_up_times: 1,
  buy_lock_volume_ratio: 1,
  sell_lock_volume_ratio: 1,
  last_limit_up: 1,
  limit_up_days: 1,
  m_days_n_boards_boards: 1,
  m_days_n_boards_days: 1,
  surge_reason: 1,
  turnover_ratio: 1,
}

// const basicPipeline = []

export interface StockPoolPipelineOptions extends PipelineGetterOptions {
  $sort?: PipelineStage.Sort['$sort']
}

export function stockPoolQuery(matchs: PipelineProp<IStockPool>, options: StockPoolPipelineOptions = {}): PipelineStage[] {
  const {
    $sort = {
      code: -1,
    },
    project,
  } = options

  return [
    {
      $match: matchs,
    },
    // ...basicPipeline,
    {
      $project: {
        ...basicProject,
        ...(project ? project : {}),
      },
    },
    {
      $sort,
    },
  ]
}
