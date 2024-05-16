import { PipelineStage, Expression, ProjectionFields } from '../mongoose'

import { PlainDataModel, SortOptions, IRequestQuery } from '@awamstock/shared/type'

export type PipelineProp<T extends PlainDataModel = PlainDataModel> = Record<keyof ProjectionFields<T>, Expression>
export type PipelineProejct<T extends PlainDataModel = PlainDataModel> = Record<keyof ProjectionFields<T>, 0 | 1>

export interface PipelineGetterOptions<T extends PlainDataModel = PlainDataModel> {
  groupFirstBy?: string
  sort?: Record<string, 1 | -1 | Expression.Meta>
  // sort?: SortOptions<IRequestQuery<T>>
  project?: PipelineProejct<T>
}

export interface PipelineGetter<T extends PlainDataModel = PlainDataModel> {
  (matches: PipelineProp<T>, options?: PipelineGetterOptions): PipelineStage[]
}
