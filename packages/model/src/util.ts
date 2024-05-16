import mongoose, { Mongoose, SchemaDefinition, SchemaDefinitionType, Schema, SchemaType, IndexDefinition, IndexOptions } from './mongoose'
import _ from 'lodash'

import { mapObj } from '@awamstock/shared/browser'
import { PlainDataModel, IStrNameMap } from '@awamstock/shared/type'
import { l } from './i18n'
export { l }
import { COLLECTIONS, CollectionConfigKey } from './collections'
import { defaultDocumentSchema, getDefaultSchemaOptions } from './models/BaseModel'

export interface ModelConfigItem {
  type?: typeof SchemaType
  required?: boolean
  strName?: string
  oriName?: string | number
  // [key: string]: any
}

export type ModelConfig<T> = Record<keyof T, ModelConfigItem>

function getTypeConstructor(literal: any): typeof SchemaType | typeof SchemaType[] {
  if (typeof literal === 'string') {
    return Schema.Types.String
  } else if (typeof literal === 'boolean') {
    return Schema.Types.Boolean
  } else if (typeof literal === 'number') {
    return Schema.Types.Number
  } else if (Array.isArray(literal)) {
    return [getTypeConstructor(literal[0]) as typeof SchemaType]
  } else if (_.isObject(literal)) {
    if (literal instanceof Date) {
      return Schema.Types.Date
    } else if (literal instanceof Buffer) {
      return Schema.Types.Buffer
    } else if (literal instanceof Map) {
      return Schema.Types.Map
    } else if (literal instanceof Schema.Types.ObjectId) {
      return Schema.Types.ObjectId
    } else {
      return Schema.Types.Mixed
    }
  } else {
    return Schema.Types.String
  }
}

const commonI18nKeys = ['id', 'code', 'symbol', 'name', 'fullname', 'alias', 'type', 'value', 'content', 'summary', 'status', 'state', 'date', 'time', 'comments']
  .concat(['area', 'industry', 'exchange', 'market'])
  .concat(['c', 'r', 'rs', 'v', 'm', 'hs', 'p']) // 用于获取i18n

export function getConfigFromData<T extends Record<string, unknown>>(data: T, config?: Partial<Record<keyof T, ModelConfigItem>>): ModelConfig<T> {
  return mapObj(data, (k, v) => {
    const type = getTypeConstructor(v)

    return {
      type,
      ...(config ? config[k] : {}),
    }
  })
}

function getTypeLiteral(type: any) {
  if (type === String) {
    return ''
  } else if (type === Number) {
    return 1
  } else {
    return ''
  }
}

export function getTypeConfig<T extends PlainDataModel>(config: ModelConfig<T>) {
  return {
    required: mapObj(
      _.pickBy(config, (o) => o.required),
      (k, v) => getTypeLiteral(v.type)
    ),
    notRequired: mapObj(
      _.pickBy(config, (o) => !o.required),
      (k, v) => getTypeLiteral(v.type)
    ),
  }
}

export interface FullConfigGetterOptions {
  strNameObj?: string
  defaultRequired?: boolean
}
export function getFullConfig<T extends PlainDataModel>(config: ModelConfig<T>, options: FullConfigGetterOptions = {}): ModelConfig<T> {
  const { strNameObj, defaultRequired = true } = options

  return mapObj(config, (k, v) => {
    const { required = defaultRequired } = v
    const item = {
      required,
      ...v,
    }

    if (!item.strName && strNameObj) {
      const prefix = commonI18nKeys.includes(String(k)) ? '' : strNameObj + '.'
      item.strName = l(`${prefix}${String(k)}`)
    }

    return item
  })
}

export function getStrNameMap<T extends PlainDataModel>(config: ModelConfig<T>): IStrNameMap<T> {
  return mapObj(config, (k, v) => v.strName)
}

// export function getMap(config: ModelConfig, mapKey = 'map'): Record<string, string> {
//   const mapConfig = _.pickBy(config, (v) => !_.isEmpty(v[mapKey]))
//   return _.invert(mapObj(mapConfig, (k, v) => v[mapKey]))
// }

export type IMap = Record<string, string>
export function getMap<T extends PlainDataModel>(config: ModelConfig<T>): Record<string, keyof T> {
  // 非空oriName，或者oriName为数字（对于数组类型）
  const mapConfig = _.pickBy(config, (v) => !_.isEmpty(v.oriName) || _.isInteger(v.oriName))
  return _.invert(mapObj(mapConfig, (k, v) => v.oriName))
}

export function getOriData<T extends PlainDataModel>(data: T, map: Partial<Record<string, keyof T>>): Record<string, any> {
  return mapObj(data, _.invert(map) as Partial<Record<keyof T, string>>)
}

export function getSchema<T>(config: ModelConfig<T>): SchemaDefinition<SchemaDefinitionType<unknown>> {
  return mapObj(config, (k, v) => {
    const { type, required } = v
    return {
      type,
      required,
    }
  })
}

export class ModelFactory<T extends PlainDataModel> {
  config: ModelConfig<T>
  fullConfig: ModelConfig<T>
  map: Partial<Record<string, keyof T>>
  strNameMap: IStrNameMap<T>
  oriData: Record<string, any>
  oriDataKeys: string[]
  schemaGetter: (mongoose: Mongoose) => mongoose.Schema<T>
  modelGetter: (mongoose: Mongoose) => mongoose.Model<T>
  schema: mongoose.Schema<T>
  model: mongoose.Model<T>

  constructor(
    readonly name: CollectionConfigKey,
    readonly data: { [K in keyof T]: any },
    config: Partial<Record<keyof T, ModelConfigItem>> | string[],
    readonly options: { strNameObj?: string; modelName?: string; timestamps?: boolean; index?: [IndexDefinition, IndexOptions?] } = {}
  ) {
    const { strNameObj = name } = options

    if (Array.isArray(config)) {
      this.config = getConfigFromData(
        data,
        config.reduce(
          (prev: Partial<Record<keyof T, ModelConfigItem>>, key) => ({
            ...prev,
            key: { required: true },
          }),
          {} as Partial<Record<keyof T, ModelConfigItem>>
        )
      )
    } else {
      this.config = getConfigFromData(data, config)
    }

    this.fullConfig = getFullConfig(this.config, { strNameObj })

    this.map = getMap(this.config)

    this.strNameMap = getStrNameMap(this.fullConfig)

    this.oriData = getOriData(data, this.map)

    this.oriDataKeys = Object.keys(this.oriData)

    this.schemaGetter = function schemaGetter(this: ModelFactory<T>, mongoose: Mongoose) {
      const { timestamps = true, index } = this.options

      const schema = new mongoose.Schema<T>(
        {
          ...defaultDocumentSchema,
          ...getSchema(this.config),
        },
        {
          timestamps,
          collection: COLLECTIONS[this.name],
          ...getDefaultSchemaOptions(),
        }
      )
      if (index) {
        schema.index(...index)
      }

      return schema
    }.bind(this)

    this.schema = this.schemaGetter(mongoose)

    this.modelGetter = function modelGetter(this: ModelFactory<T>, mongoose: Mongoose) {
      const { modelName = _.upperFirst(this.name) } = this.options

      return mongoose.model<T>(modelName, this.schema)
    }.bind(this)

    this.model = this.modelGetter(mongoose)
  }
}
