/**
 * 安全分
 */
import { readExcelJson, files as FILES, mapObj, timer } from '@awamstock/shared'
import { SafeScore, safeScoreMap } from '@awamstock/model'
import { BatchWorker } from '../../worker/worker'
import { 每日复盘 } from '../../config/worker'
import { handleWorkerError } from '../exception'

export default class SafeScoreWorker extends BatchWorker {
  constructor() {
    super()
    this.config = 每日复盘
  }

  async batch(params?: Record<string, any>) {
    try {
      const date = timer.today()
      const createdAt = new Date()
      let data = await readExcelJson(FILES.safeScoreTdx, '安全分排行', 'gbk')
      data = (data || []).map((item: any) => ({
        ...mapObj(item, safeScoreMap, { saveExtra: false }),
        date,
        createdAt,
      }))

      // await SafeScore.deleteMany({})
      // await SafeScore.insertMany(data)
      data.forEach(async (item: any) => {
        await SafeScore.updateOne({ code: item.code, date }, { $set: item }, { upsert: true })
      })
      console.log('[worker] 更新安全分排行完成')
    } catch (e) {
      console.log('[worker] 更新安全分排行出错')
      handleWorkerError(e)
    }
  }
}
