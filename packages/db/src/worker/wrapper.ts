import { Model } from '@awamstock/model/mongoose'
import { before, after } from 'utils-decorators'

import * as exportsModel from '@awamstock/model'
import { connect as dbConnect, close as dbClose } from '../db'
import { initSocket, closeSocket } from '../server/index'

const models = Object.values(exportsModel).filter((e) => {
  if ('modelName' in e) {
    return e.modelName
  }
}) as Model<any>[]

let collectionInitState = 'no'
export const initCollections = async function initCollections() {
  if (['inited', 'initing'].includes(collectionInitState)) return

  collectionInitState = 'initing'
  await Promise.all(models.map((m) => m.init()))
  console.log('[db] init collections success')
  collectionInitState = 'inited'
}

export const beforeStart = async function beforeStart() {
  await Promise.all([dbConnect(), initSocket()])
  await initCollections()
}

export const beforeWorkerStart = before({
  func: beforeStart,
})

export const afterAll = async function afterAll() {
  await Promise.all([dbClose(), closeSocket()])
}
