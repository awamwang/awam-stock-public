import mongoose from 'mongoose'

/* eslint-disable @typescript-eslint/ban-types */
declare module 'mongoose' {
  interface IndexValues<T> extends IndexOptions {
    values: UpdateQuery<T>
  }

  interface Model<
    TRawDocType,
    TQueryHelpers = {},
    TInstanceMethods = {},
    TVirtuals = {},
    THydratedDocumentType = HydratedDocument<TRawDocType, TVirtuals & TInstanceMethods, TQueryHelpers>,
    TSchema = any
  > extends NodeJS.EventEmitter,
      AcceptsDiscriminator,
      IndexManager,
      SessionStarter {
    getIndexValues(doc: UpdateQuery<TRawDocType>): IndexValues<TRawDocType>
    getModelProps(withReserved?: boolean): Array<keyof TRawDocType>

    uniqueUpsert<ResultDoc = THydratedDocumentType>(
      doc: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
      options?: QueryOptions<TRawDocType> | null
    ): QueryWithHelpers<UpdateWriteOpResult, ResultDoc, TQueryHelpers, TRawDocType>

    uniqueBulkSave(doc: Array<Document> | Array<TRawDocType>, options?: InsertManyOptions & SaveOptions & { reservedProps?: Array<keyof TRawDocType> }): Promise<Document[]>
  }
}
/* eslint-enable @typescript-eslint/ban-types */

export default mongoose
export * from 'mongoose'
