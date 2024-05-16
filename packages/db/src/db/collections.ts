import { Collection } from '@awamstock/model/mongoose'

import { connect } from './db'
export { COLLECTIONS } from '@awamstock/model'
import { COLLECTIONS, CollectionConfigKey } from '@awamstock/model'
import { NONE } from '@awamstock/shared'

interface CollectionGetter {
  (id: CollectionConfigKey): Promise<Collection>
  (): Promise<Collection>
}

export const collection = async function collection<K extends CollectionConfigKey>(id: K): Promise<Collection> {
  if (id === NONE) {
    throw new Error(`${NONE} is not a valid collection id`)
  }

  const connection = await connect()

  if (!COLLECTIONS[id]) {
    return connection.collection('unknown')
  }

  return connection.collection(COLLECTIONS[id])
}

export const thsDepartmentTrade: CollectionGetter = async function thsDepartmentTrade() {
  return (await connect()).collection(COLLECTIONS.thsDepartmentTrade)
}

export const focusedDepartment: CollectionGetter = async function focusedDepartment() {
  return (await connect()).collection(COLLECTIONS.focusedDepartment)
}

export default collection
