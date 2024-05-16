/**
 * 需要使用quicker的[ths]问财搜索保存
 * 保存营业部龙虎榜数据到数据库
 *
 */
import _ from 'lodash'
import fs from 'fs-extra'
import nfs from 'node:fs'
import dayjs from 'dayjs'

import { files as FILES, parseThsWencaiTable, DATE_FORMAT } from '@awamstock/shared'
import { DepartmentTrade, departmentTradeMap } from '@awamstock/model'
import { BatchWorker } from '../worker'
import { beforeStart } from '../wrapper'
import { ignoreDbError } from '../../db'
import { handleWorkerError } from '../exception'

async function getRawHtmlList(date?: string): Promise<string[]> {
  const stat = nfs.statSync(FILES.departmentTradeInput)
  if (dayjs(stat.mtime).format(DATE_FORMAT) !== dayjs(date).format(DATE_FORMAT)) {
    throw new Error('[worker] 营业部龙虎榜输入文件不存在')
  }

  // console.log(stat)
  return await fs.readFile(FILES.departmentTradeInput, 'utf8').then((data) => {
    const list = data.split('***').map((item) => item.trim())
    return list
  })
}

function parseTableData(html: string) {
  const list = parseThsWencaiTable(html, {
    headMap: departmentTradeMap,
    numberConvert: ['d_sort', 'buy', 'but_rate', 'sell', 'sell_rate', 'net'],
  })

  return list
}

async function departmentTrade(date?: string) {
  const htmlList = await getRawHtmlList(date)

  return await Promise.all(
    htmlList.map(async (html) => {
      const list = parseTableData(html)
      date = date || list[0].date
      await DepartmentTrade.deleteMany({ date })
      await DepartmentTrade.create(list).catch(ignoreDbError)

      return list
    })
  )
}

async function run(date?: string) {
  await beforeStart()

  await departmentTrade(date).catch(handleWorkerError)
  console.log(`[worker] 营业部龙虎榜保存完成${date ? '-' + date : ''}`)
}

export default class DepartmentTradeWorker extends BatchWorker {
  async batch(params: Record<string, any>) {
    const { date } = params

    await departmentTrade(date).catch(handleWorkerError)
    console.log(`[worker] 营业部龙虎榜保存完成${date ? '-' + date : ''}`)
  }
}

// run()
