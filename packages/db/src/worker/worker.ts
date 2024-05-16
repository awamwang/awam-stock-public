import mongoose from '@awamstock/model/mongoose'

import { CollectionConfigKey } from '@awamstock/model'
import { NONE, _, PlainDataModel } from '@awamstock/shared'
import { collection, ignoreDbError, connect } from '../db/index'
import { cleanCollction } from './cleaner/db'
import getSocketClient, { SOCKET_EVENTS, MySocket, ISocketData, SocketDataType } from '../server/socket-client'
import getSocketServer, { MySocket as MySocketServer } from '../server/socket-server'

const NO_EMIT_DATA = process.env.NO_EMIT_DATA

export interface IWorkerConfig<T extends PlainDataModel = PlainDataModel> {
  // 定时任务配置
  name?: string
  freq?: 'day' | 'hour' | 'minute'
  timeLimit?: string
  upsert?: boolean
  saveData?: boolean
  useBulkSave?: boolean | Array<keyof T>
  needArchive?: boolean
  emitData?: boolean
  emitFields?: Array<keyof T>
  retry?: number
}
const ConfigurableProps = ['freq', 'timeLimit', 'saveData', 'useBulkSave', 'upsert', 'needArchive', 'emitData', 'emitFields', 'retry']
type WorkResult = any
const DefaultRetry = 2

export interface IWorker<T extends PlainDataModel = PlainDataModel> {
  name: string
  params?: Record<string, any>
  work(params?: Record<string, any>): WorkResult // 工作，返回工作结果
  config?: IWorkerConfig<T> // 工作配置
  // collectionId?: CollectionConfigKey // 工作关联的db collectionId
}

export class BatchWorker<T extends PlainDataModel = PlainDataModel> implements IWorker<T> {
  name = 'defaultBatchWorker'
  protected data: any
  protected retry = DefaultRetry

  constructor(public config: IWorkerConfig<T> = {}) {
    if (this.constructor.name !== 'DataWorker') {
      this.name = config.name || this.constructor.name
    }
  }

  protected async init() {
    this.config = _.defaults(this.config, _.pick(this, ConfigurableProps))
    //
  }

  protected async beforeWork() {
    await connect()
  }

  protected async tryWork(params?: Record<string, any>) {
    try {
      this.data = await this.batch(params)
    } catch (error) {
      if (this.retry > 0) {
        this.retry--
        await this.tryWork(params)
        return
      } else {
        console.error('[worker]batch error', error)
      }
    }

    this.retry = this.config.retry || DefaultRetry
  }

  async work(params?: Record<string, any>): Promise<WorkResult> {
    await this.init()
    await this.beforeWork()
    await this.tryWork(params)
    await this.afterWork()

    return this.data
  }

  protected async batch(params?: Record<string, any>): Promise<unknown> {
    throw new Error('Method not implemented.')
  }

  async afterWork() {
    //
  }
}

export interface IDataWorkerData extends PlainDataModel {
  time?: number
}
export class DataWorker<T extends IDataWorkerData = IDataWorkerData> implements IWorker<T> {
  name = 'defaultDataWorker'
  protected data: T | T[] | null = null
  protected model?: mongoose.Model<T>
  protected collectionId: CollectionConfigKey | typeof NONE = NONE
  protected collection?: mongoose.Collection
  protected socket?: MySocket
  protected socketServer?: MySocketServer
  // 配置
  protected saveData = true
  protected useBulkSave: IWorkerConfig<T>['useBulkSave'] = false
  protected upsert = false
  protected needArchive = false
  protected emitData = !NO_EMIT_DATA
  protected emitFields: IWorkerConfig<T>['emitFields'] = []
  protected socketDataName?: SocketDataType
  protected retry = DefaultRetry

  constructor(public config: IWorkerConfig<T> = {}) {
    if (this.constructor.name !== 'DataWorker') {
      this.name = config.name || this.constructor.name
    }
  }

  protected async init() {
    this.config = _.defaults(this.config, _.pick(this, ConfigurableProps))

    if (this.model) {
      this.collection = this.model.collection
    } else if (this.collectionId && this.collectionId !== NONE) {
      this.collection = await collection(this.collectionId)
    }
    if (this.config.emitData) {
      this.socket = await getSocketClient()
      this.socketServer = await getSocketServer()
    }
  }

  protected async beforeWork() {
    await connect()
  }

  protected async get(params?: Record<string, string | number>): Promise<T | T[]> {
    throw new Error('Method not implemented.')
  }

  protected async tryWork(params?: Record<string, any>) {
    try {
      this.data = await this.get(params)
    } catch (error) {
      if (this.retry > 0) {
        this.retry--
        await this.tryWork(params)
        return
      } else {
        console.error('[worker]get error', error)
      }
    }

    this.retry = this.config.retry || DefaultRetry
  }

  async work(params?: Record<string, string | number>): Promise<WorkResult> {
    await this.init()
    await this.beforeWork()
    await this.tryWork(params)
    await this.afterWork()
    if (this.config.saveData && this.collection) {
      await this.save()
    }

    return this.data
  }

  protected async save() {
    if (!this.data) {
      console.warn(`[worker] ${this.name} data is empty`, this.data)
      return
    }

    try {
      if (Array.isArray(this.data)) {
        if (!this.data) {
          console.warn(`[worker] ${this.name} data is empty`, this.data)
          return
        }

        if (this.config.upsert) {
          await this._upsertMany()
        } else {
          await this._insertMany()
        }
      } else {
        if (this.model) {
          await new this.model(this.data).save()
        } else {
          await this.upsertByTime()
        }
      }
    } catch (error) {
      console.error(`[worker] ${this.name} save error`, error)
    }
  }

  private async sendSocketData(msg: ISocketData<any>) {
    if (this.socket) {
      await this.socket.emit(SOCKET_EVENTS.dbData, msg)
    }
    if (this.socketServer) {
      await this.socketServer.emit(SOCKET_EVENTS.dbData, msg)
    }
  }

  /**
   * 后置处理（发送socket数据）
   */
  protected async afterWork() {
    try {
      if (!this.config.emitData) return

      let sendData: Partial<T> | Partial<T>[] | null = this.data || {}

      if (this.config.emitFields!.length) {
        if (Array.isArray(this.data)) {
          sendData = this.data.map((item) => _.pick(item, this.config.emitFields as Array<keyof T>))
        } else {
          sendData = _.pick(this.data, this.config.emitFields as Array<keyof T>)
        }
      }

      await this.sendSocketData({ name: (this.socketDataName || this.name) as SocketDataType, data: sendData })
    } catch (err) {
      console.error('[worker] afterWork error')
    }
  }

  /**
   * 数据库处理
   */
  protected async _insertOne() {
    if (this.collection) {
      await this.collection.insertOne(this.data as T)
    }
  }

  protected async upsertByTime() {
    if (this.collection) {
      const uqiueQuery: {
        time?: number
        createdAt?: string
      } = {}
      const data = this.data as T

      if (data.time) {
        uqiueQuery.time = data.time
      } else if (data.createdAt) {
        uqiueQuery.createdAt = data.createdAt
      }

      await this.collection.updateOne(
        uqiueQuery,
        {
          $set: this.data,
        },
        {
          upsert: true,
        }
      )
    }
  }

  protected async _insertMany() {
    const data = this.data as T[]

    if (this.collection) {
      await this.collection.insertMany(data).catch(ignoreDbError)
    }
  }

  protected async _upsertMany() {
    if (!this.model) return

    const data = this.data as T[]
    if (this.config.useBulkSave) {
      await this.model.uniqueBulkSave(data, { reservedProps: Array.isArray(this.config.useBulkSave) ? this.config.useBulkSave : undefined }).catch(ignoreDbError)
    } else {
      data.forEach(async (item) => {
        this.model && (await this.model.uniqueUpsert(item, { strict: false }).catch(ignoreDbError))
      })
    }
  }

  async archive() {
    if (this.collection && this.config.needArchive) {
      await cleanCollction(this.collection.collectionName as CollectionConfigKey)
    }
  }
}

// export function getDataClass(
//   model: mongoose.Model<any>,
//   url: string,
//   dataCallback: (data: any) => any
// ) {
//   return class Inner extends DataWorker<typeof model> {
//     constructor() {
//       super()
//       this.model = model
//     }

//     async get() {
//       const res = await myFetch(url)

//       return dataCallback(res)
//     }
//   }
// }
