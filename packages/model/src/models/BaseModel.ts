import { PlainDataModel } from '@awamstock/shared/type'
import { _ } from '@awamstock/shared/browser'
import { SchemaOptions, IndexDefinition, IndexOptions, UpdateQuery, Model } from '../mongoose'

export interface IBaseDocument {
  createdAt?: Date
  updatedAt?: Date
  _id?: string
  date?: string
}

export const defaultDocumentSchema = {
  date: { type: String, require: false },
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: { type: Date, default: Date.now },
}

export interface IndexValues<T = PlainDataModel> extends IndexOptions {
  values: UpdateQuery<T>
}

export function getDefaultSchemaOptions<T extends PlainDataModel = PlainDataModel>() {
  const defaultSchemaOptions: SchemaOptions<T> = {
    statics: {
      getIndexValues(this: Model<T>, doc: T): IndexValues<T> {
        const indexConfig: IndexDefinition = this.schema.indexes()[0]
        const indexes = Object.keys(indexConfig[0])

        return {
          values: _.zipObject(
            indexes,
            indexes.map((item) => doc[item])
          ),
          ...(indexConfig[1] as IndexOptions),
        }
      },

      getModelProps(this: Model<T>, withReserved?: boolean): Array<keyof T> {
        return withReserved ? Object.keys(this.schema.paths) : Object.keys(this.schema.obj)
      },

      uniqueUpsert(this: Model<T>, doc: T, options?: any) {
        const { values: uniqueFilter, unique } = this.getIndexValues(doc)

        return this.updateOne(unique ? uniqueFilter : { _id: null }, doc, {
          upsert: true,
          ...options,
        })
      },

      /**
       * 该方法慎用，为了更新的准确识别，该方法使用深度比较，耗费性能
       * @param docs
       * @param options
       * @returns
       * @memberof IBaseModel
       */
      async uniqueBulkSave(this: Model<T>, docs: T[], options: any = {}) {
        const oldData = await this.find({})
        const newData: any[] = []
        const changeData: any[] = []
        const { reservedProps } = options

        docs.forEach((item) => {
          const indexValues = this.getIndexValues(item).values
          const oldItem = oldData.find((old: any) => Object.keys(indexValues).every((key) => old[key] === indexValues[key]))

          if (oldItem) {
            const propsToUpdate = this.getModelProps().filter((key) => !_.isUndefined(item[key]) && !reservedProps?.includes(key))
            const isChanged = propsToUpdate.some((key) => !_.isEqual(oldItem[key], item[key]))

            isChanged && changeData.push(Object.assign(oldItem, _.pick(item, propsToUpdate)))
          } else {
            newData.push(item as any)
          }
        })

        await this.insertMany(newData, options)
        // return await this.bulkSave(oldData, options)
        return await Promise.all(oldData.map((item) => item.save(options)))
      },
    },
  }

  return defaultSchemaOptions
}

export type IDocument<T extends PlainDataModel, P extends keyof T | '' = '', E extends { [K in keyof T]?: any } | null | undefined = null> =
  // 处理没有扩充类型的情况
  (E extends null | undefined ? Omit<T, P> : E) &
    // 处理没有可选值得情况
    (P extends '' ? Omit<T, keyof E> : Partial<Pick<T, Exclude<P, ''>>> & Omit<T, P | keyof E>) &
    Omit<IBaseDocument, keyof T>
