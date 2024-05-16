import dayjs from 'dayjs'

import { CollectionConfigKey } from '@awamstock/model'
import { DATE_FORMAT, NONE } from '@awamstock/shared'
import { collection, ignoreDbError } from '../../db/index'
import { nTradeDayAgo } from '../data/calendar/calendar'
import { handleWorkerError } from '../exception'

const SAVE_DAYS = 3 // 保留近几个交易日的数据

export async function cleanCollction(id: CollectionConfigKey) {
  if (id === NONE) {
    return
  }

  const c = await collection(id)
  const c_full = await collection((id + '_full') as CollectionConfigKey)

  const targetDate = dayjs(await nTradeDayAgo(SAVE_DAYS), DATE_FORMAT)
  const utcTime = new Date(targetDate.valueOf())
  const list = await c
    .find({ createdAt: { $lte: utcTime } })
    .sort({ createdAt: -1 })
    .toArray()
  // const targetTime = targetDate.add(15, 'hour').add(10, 'second')
  // const utcTime = new Date(targetTime.valueOf())

  // // 15点前的迁移
  // await c_full.insertMany(list).catch(ignoreDbError)
  // await c.deleteMany({ createdAt: { $lte: utcTime } })

  // // 15点后的去重(每天只保留最后一条数据)
  // const startUtcTime = new Date(targetDate.valueOf())
  // const endUtcTime = new Date(targetDate.add(1, 'day').valueOf())
  // const dupList = await c.find({ createdAt: { $gte: startUtcTime, $lte: endUtcTime } }).toArray()

  const dateList: string[] = []
  await Promise.all(
    list.map(async (doc) => {
      // const time = doc.updatedAt
      const time = dayjs(doc.createdAt)
      const date = time.format(DATE_FORMAT)
      const hour = time.hour()
      const minute = time.minute()
      const is盘中 = hour >= 9 && hour < 15
      if (is盘中) {
        // 15点前的迁移
        await c_full.insertOne(doc).catch(ignoreDbError)
        await c.deleteOne({ _id: doc._id })
        // console.log(time.format('YYYY-MM-DD HH:mm:ss'))
      } else {
        // 15点后的去重(每天只保留最后一条数据)
        if (dateList.includes(date)) {
          await c.deleteOne({ _id: doc._id })
        } else {
          dateList.push(date)
        }
        // console.log(time.format('YYYY-MM-DD HH:mm:ss'))
      }
    })
  )
}

export async function cleanCollections(collections: Array<CollectionConfigKey>) {
  await Promise.all(
    collections.map(async (id) => {
      if (id) {
        cleanCollction(id)
      }
    })
  ).catch(handleWorkerError)
}
