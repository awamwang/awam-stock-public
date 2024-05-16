import { _, timer, dayjs, DATE_TIME_FORMAT } from '@awamstock/shared'
import { Block, IBlock, BlockFrom, IBlockLink } from '@awamstock/model'

import { BatchWorker } from '../../../worker/worker'
import { 每日复盘 } from '../../../config/worker'
import { handleWorkerError } from '../../exception'

/**
 * 判断两个block是否能类似
 * block的name,alias相同或者相互包含, 则认为是类似的
 * 以codeList长的为基准,block的 codeList匹配程度80%以上
 * @param block1
 * @param block2
 */
function isSimilarBlock(block1: IBlock, block2: IBlock) {
  const { name: name1, alias: alias1 } = block1
  const { name: name2, alias: alias2 } = block2
  let { codeList: codeList1 } = block1
  let { codeList: codeList2 } = block2

  const nameSame = name1 === name2 || alias1 === name2 || alias2 === name1 || alias1 === alias2
  // const nameSimilar = name1.includes(name2) || name2.includes(name1) || alias1?.includes(name2) || alias2?.includes(name1) || alias1?.includes(alias2) || alias2?.includes(alias1)

  if (codeList1.length < codeList2.length) {
    // 保证codeList1是长的
    codeList1 = codeList2
    codeList2 = block1.codeList
  }
  const commonCodeAmount = codeList1.filter((code) => codeList2.includes(code)).length
  const codeListSimilar = commonCodeAmount / codeList1.length > 0.8

  return nameSame || codeListSimilar
}

/**
 * 数据库获取全部block
 * 按block from分类block
 * 遍历每类block，只与其他from的block比较，调用isSimilarBlock判断是否相似，如果相似在link字段中添加值
 * 这里找到每个其他form的similarBlock唯一
 * 最后更新数据库，要注意已有数据保留
 */
async function updateBlockLink() {
  // let counter = 0
  // const date = dayjs(timer.today() + ' 00:00:00', DATE_TIME_FORMAT)
  // const blocks = await Block.find({ updatedAt: { $gte: date } })
  const blocks = await Block.find({})
  const classifiedBlocks = _.groupBy(blocks, 'from')
  const blockFromList = Object.keys(classifiedBlocks) as BlockFrom[]

  for (const from1 of blockFromList) {
    const blocks = classifiedBlocks[from1]

    for (const block of blocks) {
      const link: IBlockLink = block.link || {}

      for (const from of blockFromList) {
        const isValidLink = /\d{6}/.test(link[from] || '')
        if (from1 === from || isValidLink) {
          continue
        }

        const similarBlock = classifiedBlocks[from].find((b) => isSimilarBlock(block, b))

        if (similarBlock) {
          link[from] = similarBlock.code
        }
      }

      block.link = link

      // counter++
      // if (counter % 10 === 0) {
      //   console.log(`${new Date()} [worker] 更新block-link: ${counter}/${blocks.length}`)
      // }
    }
  }

  await Block.uniqueBulkSave(blocks, { timestamps: false })
}

export default class BlockLinkWorker extends BatchWorker {
  constructor() {
    super()
    this.config = 每日复盘
  }

  async batch(params?: Record<string, any>) {
    try {
      await updateBlockLink()

      console.log(`[worker] 更新block-link完成`)
    } catch (e) {
      console.log('[worker] 更新block-link出错')
      handleWorkerError(e)
    }
  }
}

// new BlockLinkWorker().work()
