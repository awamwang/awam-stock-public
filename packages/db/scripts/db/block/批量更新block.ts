/**
 * 批量更新block
 *
 */
import _ from 'lodash'
import dayjs from 'dayjs'

import '@awamstock/shared/mongoose'
import { files as FILES, parseThsWencaiTable, DATE_FORMAT, mapObj } from '@awamstock/shared'
import * as models from '@awamstock/model'
import { IBlock } from '@awamstock/model'
import { beforeStart } from '../../../src/worker/wrapper'
import { handleWorkerError } from '../../../src/worker/exception'
import { ignoreDbError, collection } from '../../../src/db/index'

const data = [
  {
    code: '880785',
    name: '最近多板',
    stockCount: 14,
    from: 'tdx',
    type: 'qx',
    updatedAt: '2023-04-04T14:20:20.704Z',
    tags: ['hidden'],
  },
  {
    code: '880872',
    name: '近期复牌',
    stockCount: 26,
    from: 'tdx',
    type: 'fg',
    updatedAt: '2023-04-04T14:20:20.704Z',
    tags: null,
    link: {
      ths: '883919',
    },
  },
]

async function scrpit(date?: string) {
  // const c_m = models.GlobalMarket
  // const c_ms = await collection('block')

  const blocks = await models.Block.find({})

  for (let i = 0; i < data.length; i++) {
    const block = blocks.find((item: any) => item.code === data[i].code)
    if (block) {
      Object.assign(block, data[i])
      block.save({ timestamps: false })
      // c_ms.updateOne({ _id: block._id }, { $set: block }, {time})
    }
  }
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
