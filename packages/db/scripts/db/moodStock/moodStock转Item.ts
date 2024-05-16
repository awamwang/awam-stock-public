/**
 * 转换moodStock的数据
 *
 */
import _ from 'lodash'
import dayjs from 'dayjs'

import '@awamstock/shared/mongoose'
import { files as FILES, parseThsWencaiTable, DATE_FORMAT, mapObj } from '@awamstock/shared'
import * as models from '@awamstock/model'
import { beforeStart } from '../../../src/worker/wrapper'
import { handleWorkerError } from '../../../src/worker/exception'
import { ignoreDbError, collection } from '../../../src/db/index'

async function scrpit(date?: string) {
  // const c_m = models.GlobalMarket
  const c_ms = await collection('moodStock')
  const c_mb = await collection('moodBlock')
  // const c_ms = await collection('moodStock_full')
  // const c_mb = await collection('moodBlock_full')

  const list_s = await c_ms.find({}).toArray()
  const list_b = await c_mb.find({}).toArray()

  // await Promise.all(
  //   list.map(async (item) => {
  //     return m.findByIdAndUpdate(item._id, {
  //       $set: { date: dayjs(item.date, 'YYYY-MM-DD').format(DATE_FORMAT) },
  //     })
  //   })
  // )

  await Promise.all(
    list_s.map(async (item) => {
      return c_ms.updateOne(
        { _id: item._id },
        {
          $set: { list: item.list.map((item: any) => mapObj(item, models.moodStockItemMap, { saveExtra: true })) },
        }
      )
    })
  )
  await Promise.all(
    list_b.map(async (item) => {
      return c_mb.updateOne(
        { _id: item._id },
        {
          $set: { list: item.list.map((item: any) => mapObj(item, models.moodBlockItemMap, { saveExtra: true })) },
        }
      )
    })
  )
}

async function run(date?: string) {
  await beforeStart()

  try {
    await scrpit(date)
    console.log('[db] scrpit执行完成')
  } catch (e) {
    handleWorkerError(e)
  }
}

export default run

run()
