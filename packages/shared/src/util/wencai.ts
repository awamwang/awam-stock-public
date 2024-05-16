import cheerio from 'cheerio'
import _ from 'lodash'

import { parseStrNumber } from './browser/lang'
import { IStrNameMap } from '../type/data'

type WencaiParseOptions = {
  headMap?: IStrNameMap<Record<string, any>>
  numberConvert?: string[]
  keepIndex?: boolean
  unknown?: string
}

function parseWencaiTableHeads(html: string, options: WencaiParseOptions = {}) {
  const { headMap, keepIndex, unknown } = options

  const $ = cheerio.load(html, {})
  const fixedTableHeads = $('.iwc-table-fixed > div.iwc-table-header ul > li span:first-of-type')
    .map((i, e) => $(e).text().trim())
    .get()
  let heads = fixedTableHeads.concat(
    $('.iwc-table-scroll > div.iwc-table-header ul > li span:first-of-type')
      .map((i, e) => $(e).text().trim())
      .get()
  )

  if (!keepIndex) {
    heads.shift() // 去掉索引列
  }

  if (headMap) {
    heads = heads.map((e) => headMap[e] || unknown || 'unknown')
  }

  return heads
}

function parseWencaiTableRows(html: string, options: WencaiParseOptions = {}) {
  const { keepIndex } = options

  const $ = cheerio.load(html, {})

  const tableRows = $('div.iwc-table-body table > tbody > tr')

  return tableRows.toArray().map((e) => {
    const row = $(e)
    const cells = row
      .find('td > div')
      .toArray()
      .map((t) => $(t).text().trim())
      .filter((t) => t.length)

    if (!keepIndex) {
      cells.shift() // 去掉索引列
    }

    return cells
  })
}

/**
 * 解析问财html表格
 * @param html 保存的原始html字符串
 * @param options
 * @returns
 */
export function parseThsWencaiTable(html: string, options: WencaiParseOptions = {}): Record<string, any>[] {
  const { numberConvert = [] } = options
  const tableHeads = parseWencaiTableHeads(html, options)
  const tableRows = parseWencaiTableRows(html, options)

  // console.log(tableHeads, list.length, list[0])

  return tableRows
    .map((e) => _.zipObject(tableHeads, e))
    .map((e) => {
      const res: any = {}
      for (const key in e) {
        if (numberConvert.includes(key)) {
          res[key] = parseStrNumber(e[key])
        } else {
          res[key] = e[key]
        }
      }

      return res
    })
}
