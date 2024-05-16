export { connect, close } from './db'
import db from './db'
export * from './collections'
import { COLLECTIONS } from './collections'
export { COLLECTIONS } from './collections'
export * from './exception'

export default {
  COLLECTIONS,
  db,
}
