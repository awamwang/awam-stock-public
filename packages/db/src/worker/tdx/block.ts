import path from 'node:path'

import pyRunner from '../py-runner'
import { BatchWorker } from '../../worker/worker'
import { 每日复盘 } from '../../config/worker'
import { handleWorkerError } from '../exception'

export default class BlockWorker extends BatchWorker {
  constructor() {
    super()
    this.config = 每日复盘
  }

  async batch(params?: Record<string, any>) {
    try {
      const stdout = await pyRunner(path.resolve(__dirname, './block-getter.py'))
      console.log('py:\n', stdout)
      console.log('[worker] 更新通达信板块完成')
    } catch (e) {
      console.log('[worker] 更新通达信出错')
      handleWorkerError(e)
    }
  }
}

// new BlockWorker().work()
