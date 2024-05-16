/**
 * 需要使用quicker的[ths]问财搜索保存
 * 保存营业部龙虎榜数据到数据库
 *
 */
import _ from 'lodash'

import '@awamstock/shared/mongoose'
import { files as FILES, parseThsWencaiTable, DATE_FORMAT, mapObj } from '@awamstock/shared'
import * as models from '@awamstock/model'
import { beforeStart } from '../../worker/wrapper'
import { handleWorkerError } from '../../worker/exception'
import { ignoreDbError, collection } from '../index'

async function scrpit(date?: string) {
  // const c_m = models.GlobalMarket
  const from = await collection('radar_full')
  const c_m = await collection('radar')

  const list = await from.find({}).toArray()

  await Promise.all(
    list.map(async (data) => {
      return await c_m.insertOne(data).catch(ignoreDbError)
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
