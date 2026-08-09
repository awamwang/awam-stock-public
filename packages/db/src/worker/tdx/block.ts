import path from 'node:path'

import { ensureTdxDirAvailable, files as FILES, skipIfPathInvalid } from '@awamstock/shared'
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
      if (!ensureTdxDirAvailable('更新通达信板块')) {
        return
      }
      const hqCacheDir = path.join(FILES.tdxDir, 'T0002', 'hq_cache')
      if (skipIfPathInvalid(hqCacheDir, 'dir', '更新通达信板块')) {
        return
      }

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
