/**
 * 全部document字段替换
 */
import _ from 'lodash'
import dayjs from 'dayjs'

import '@awamstock/shared/mongoose'
import { files as FILES, parseThsWencaiTable, DATE_FORMAT } from '@awamstock/shared'
import * as models from '@awamstock/model'
import { beforeStart } from '../src/worker/wrapper'
import { handleWorkerError } from '../src/worker/exception'
import { ignoreDbError, collection } from '../src/db/index'

async function scrpit(date?: string) {
  // const c_m = models.GlobalMarket
  const c_m = await collection('moodStock')

  const list = await c_m.find({}).toArray()

  // await Promise.all(
  //   list.map(async (item) => {
  //     return m.findByIdAndUpdate(item._id, {
  //       $set: { date: dayjs(item.date, 'YYYY-MM-DD').format(DATE_FORMAT) },
  //     })
  //   })
  // )

  await Promise.all(
    list.map(async (item) => {
      return c_m.updateOne(
        { _id: item._id },
        {
          $set: { date: dayjs(item.date, 'YYYY-MM-DD').format(DATE_FORMAT) },
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
