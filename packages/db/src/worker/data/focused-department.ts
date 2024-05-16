import path from 'node:path'
import fs from 'fs-extra'
import dayjs from 'dayjs'
import _ from 'lodash'

import { BatchWorker } from '../worker'
import { beforeStart } from '../wrapper'
import { FocusedDepartment, IFocusedDepartment } from '@awamstock/model'

const FocusedDepartmentDir = path.resolve(__dirname, '../../../data/龙虎/awamstock')

async function getDepartmentList(date?: string): Promise<IFocusedDepartment[]> {
  return await fs.readJson(`${FocusedDepartmentDir}/focusedDepartment${date ? '-' + date : ''}.json`)
}

async function saveCopy(): Promise<void> {
  // console.log('saveCopy', `${FocusedDepartmentDir}/focusedDepartment-${dayjs().format('YYYYMMDD')}.json`);
  await fs.copy(`${FocusedDepartmentDir}/focusedDepartment.json`, `${FocusedDepartmentDir}/history/focusedDepartment-${dayjs().format('YYYYMMDD')}.json`)
}

async function checkDuplicate(list: IFocusedDepartment[]) {
  const indexList = list.map((data) => `${data.type}-${data.name}`)
  const uniq = _.uniq(indexList)

  if (uniq.length !== indexList.length) {
    const duplicateList = indexList.filter((item) => indexList.indexOf(item) !== indexList.lastIndexOf(item))

    duplicateList.forEach((data) => {
      console.error(`duplicate data ${data}`)
      // throw new Error(`duplicate data ${data}`)
    })
  }
}

async function focusedDepartment(date?: string) {
  const 关注营业部列表 = await getDepartmentList(date)
  await checkDuplicate(关注营业部列表)

  await Promise.all(
    关注营业部列表.map(async (data) => {
      return FocusedDepartment.uniqueUpsert(data)
    })
  )

  if (!date) {
    await saveCopy()
  }
}

const run = async function run(date?: string) {
  await beforeStart()

  await focusedDepartment(date).catch(console.error)
  console.log(`[data] 添加关注营业部列表完成${date ? '-' + date : ''}`)
}

export default class FocusedDepartmentWorker extends BatchWorker {
  async batch(params: Record<string, any>) {
    const { date } = params

    await focusedDepartment(date).catch(console.error)
    console.log(`[data] 添加关注营业部列表完成${date ? '-' + date : ''}`)
  }
}

// run()
