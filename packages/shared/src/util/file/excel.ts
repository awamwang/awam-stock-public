import { readFile } from '../fs'
import { read, utils } from 'xlsx'

export async function readExcel(path: string, encoding = 'utf8') {
  const buf = await readFile(path, encoding)
  return await read(buf, { type: 'string' })
}

export async function readExcelJson(path: string, sheetName?: string, encoding = 'utf8') {
  const workbook = await readExcel(path, encoding)
  const data = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])

  return data
}
