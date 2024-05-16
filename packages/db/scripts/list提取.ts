/**
 * 需要使用quicker的[ths]问财搜索保存
 * 保存营业部龙虎榜数据到数据库
 *
 */
import _ from 'lodash'
import fs from 'fs-extra'
import nfs from 'node:fs'
import dayjs from 'dayjs'
import { config as envConfig } from 'dotenv'
envConfig({ path: process.env.STDB_ENV ? `envs/${process.env.STDB_ENV}.env` : undefined })

import '@awamstock/shared/mongoose'
import { files as FILES, parseThsWencaiTable, DATE_FORMAT, mapObj } from '@awamstock/shared'
import * as models from '@awamstock/model'
import { beforeStart } from '../src/worker/wrapper'
import { handleWorkerError } from '../src/worker/exception'
import { ignoreDbError, collection } from '../src/db/index'

async function scrpit(date?: string) {
  // const c_m = models.GlobalMarket
  const from = await collection('radar_old')
  const c_m = await collection('radar')

  const list = await from.find({}).toArray()

  // await Promise.all(
  //   list.map(async (item) => {
  //     return m.findByIdAndUpdate(item._id, {
  //       $set: { date: dayjs(item.date, 'YYYY-MM-DD').format(DATE_FORMAT) },
  //     })
  //   })
  // )

  await Promise.all(
    list.map(async (data) => {
      const res = (data.list || []).map((item: any) => {
        const o = mapObj(item, models.radarMap)

        return {
          ...o,
          date: dayjs.unix(o.time).format(DATE_FORMAT),
        }
      })

      return await c_m.insertMany(res).catch(ignoreDbError)
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
// console.log(dayjs.unix(1654153017).format(DATE_FORMAT));
