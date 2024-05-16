import path from 'node:path'
import { _, files as FILES, readIni, timer } from '@awamstock/shared'
import { IBlock, Block, BlockType } from '@awamstock/model'

import { BatchWorker } from '../../worker/worker'
import { 每日复盘 } from '../../config/worker'
import { handleWorkerError } from '../exception'

const ThsBlockCodeMapConfig = {
  gn: {
    file: 'stockname/stockname_48_0.txt',
    key: 'name_48_48',
  },
  hy: {
    file: 'stockname/stockname_48_0.txt',
    key: 'name_48_49',
  },
}

async function getBlockCodeMap(date: string, type: keyof typeof ThsBlockCodeMapConfig) {
  if (!ThsBlockCodeMapConfig[type]) {
    throw new Error('thsBlockCodeMap type error')
  }

  const data = await readIni(path.join(FILES.thsDir, ThsBlockCodeMapConfig[type].file), 'gbk')

  if (data[ThsBlockCodeMapConfig[type].key].ConfigVer.split('_')[0] !== date) {
    throw new Error('thsBlockCodeMap may not update')
  }
  delete data[ThsBlockCodeMapConfig[type].key].ConfigVer

  return _.invert(data[ThsBlockCodeMapConfig[type].key])
}

async function getBlockStocksMap(date: string) {
  // const data = await readIni(path.join(FILES.thsDir, 'BlockUpdate/block_conception.ini'), 'gbk')
  const data = await readIni(path.join(FILES.thsDir, 'system/同花顺方案/StockBlock.ini'), 'gbk')

  if (data['ConfigInfo'].ConfigVer.split('.')[0] !== date) {
    throw new Error('thsBlockStocksMap may not update')
  }

  return _.mapValues(_.invert(data['BLOCK_NAME_MAP_TABLE']), (index) => {
    const stocksStr = data['BLOCK_STOCK_CONTEXT'][index]
    return (stocksStr ? stocksStr.split(',') : []).map((stock: string) => {
      return stock.split(':')[1]
    })
  })
}

async function saveBlocks(data: IBlock[]) {
  await Block.uniqueBulkSave(data, { reservedProps: ['date', 'type', 'alias'] })
  // data.forEach(async (item: IBlock) => {
  //   await Block.updateOne({ code: item.code, from: item.from }, { $set: item }, { upsert: true })
  // })
}

export default class ThsBlockWorker extends BatchWorker {
  constructor() {
    super()
    this.config = 每日复盘
  }

  async batch(params?: Record<string, any>) {
    try {
      const date = timer.today()
      // const date = '20230331'

      const blockCodeMaps = {
        gn: await getBlockCodeMap(date, 'gn'),
        hy: await getBlockCodeMap(date, 'hy'),
      }
      if (!blockCodeMaps.gn || !blockCodeMaps.hy) {
        return
      }
      const blockStocksMap = await getBlockStocksMap(date)

      const toBlock = (name: string, type: BlockType): IBlock => {
        const codeList = blockStocksMap[name.toUpperCase()] || [] // blockStocksMap中名称全是大写

        return {
          name,
          code: blockCodeMaps[type as 'gn' | 'hy'][name],
          alias: name,
          codeList,
          from: 'ths',
          type,
          stockCount: codeList.length,
          date,
        } as IBlock
      }

      const gnBlocks = Object.keys(blockCodeMaps['gn']).map((name) => toBlock(name, 'gn'))
      const hyBlocks = Object.keys(blockCodeMaps['hy']).map((name) => toBlock(name, 'hy'))

      await saveBlocks([...gnBlocks, ...hyBlocks])
      console.log(`[worker] 更新ths-block完成:概念-${gnBlocks.length}, 行业-${hyBlocks.length}`)
    } catch (e) {
      console.log('[worker] 更新ths-block出错')
      handleWorkerError(e)
    }
  }
}

// new ThsBlockWorker().work()
