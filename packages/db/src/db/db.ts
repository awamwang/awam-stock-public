import mongoose, { Connection } from '@awamstock/model/mongoose'
export { mongoose }
import config from '@awamstock/shared/config'

let singleConnection: Promise<Connection> | null = null

export const connect = async function connect(): Promise<Connection> {
  if (singleConnection) {
    return singleConnection
  }

  const mongo = mongoose.connect(config.db.url)
  console.log('[db] mongo connected,', config.db.shortUrl)
  // mongo.connection.useDb(config.db.name)
  // return (singleConnection = (await mongo).connection)
  return (singleConnection = mongo.then((db) => db.connection))
}

export const close = async function close() {
  if (singleConnection) {
    await (await singleConnection).close()
    singleConnection = null
  }
}

export default {
  connect,
  close,
  mongoose,
}
