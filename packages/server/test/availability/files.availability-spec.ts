import path from 'node:path'
import {
  checkPath,
  files,
  isFileDirAvailable,
  isTdxDirAvailable,
  isThsDirAvailable,
  readExcelJson,
  readFile,
  readIni,
} from '@awamstock/shared'

function assertPathOk(target: string, kind: 'dir' | 'file' | 'writable-file', label: string) {
  const result = checkPath(target, kind)
  if (!result.ok) {
    throw new Error(`[${label}] ${result.reason}`)
  }
}

describe('文件读取可用性', () => {
  describe('基础目录', () => {
    it(`共享文件目录可用: ${files.fileDir}`, () => {
      expect(isFileDirAvailable()).toBe(true)
    })

    it(`通达信目录可用: ${files.tdxDir}`, () => {
      expect(isTdxDirAvailable()).toBe(true)
    })

    it(`同花顺目录可用: ${files.thsDir}`, () => {
      expect(isThsDirAvailable()).toBe(true)
    })
  })

  describe('共享业务文件', () => {
    it(`可读取营业部龙虎榜输入: ${files.departmentTradeInput}`, async () => {
      assertPathOk(files.departmentTradeInput, 'file', '营业部龙虎榜输入')
      const content = await readFile(files.departmentTradeInput, 'utf8')
      expect(content.length).toBeGreaterThan(0)
    })

    it(`可读取安全分排行 Excel: ${files.safeScoreTdx}`, async () => {
      assertPathOk(files.safeScoreTdx, 'file', '安全分排行')
      const rows = await readExcelJson(files.safeScoreTdx)
      expect(Array.isArray(rows)).toBe(true)
      expect(rows.length).toBeGreaterThan(0)
    })

    it(`龙虎危险导出路径可写: ${files.riskyLonghu}`, () => {
      assertPathOk(files.riskyLonghu, 'writable-file', '龙虎危险导出')
    })
  })

  describe('通达信关键路径', () => {
    const hqCacheDir = path.join(files.tdxDir, 'T0002', 'hq_cache')

    it(`行情缓存目录可用: ${hqCacheDir}`, () => {
      assertPathOk(hqCacheDir, 'dir', '通达信行情缓存')
    })
  })

  describe('同花顺关键文件', () => {
    const stocknameFile = path.join(files.thsDir, 'stockname', 'stockname_48_0.txt')
    const stockBlockIni = path.join(files.thsDir, 'system', '同花顺方案', 'StockBlock.ini')

    it(`可读取板块名称配置: ${stocknameFile}`, async () => {
      assertPathOk(stocknameFile, 'file', '同花顺板块名称')
      const data = await readIni(stocknameFile, 'gbk')
      expect(data).toEqual(expect.any(Object))
      expect(Object.keys(data).length).toBeGreaterThan(0)
    })

    it(`可读取板块成分配置: ${stockBlockIni}`, async () => {
      assertPathOk(stockBlockIni, 'file', '同花顺板块成分')
      const data = await readIni(stockBlockIni, 'gbk')
      expect(data).toEqual(expect.any(Object))
      expect(data.ConfigInfo || data.BLOCK_NAME_MAP_TABLE).toBeDefined()
    })
  })
})
