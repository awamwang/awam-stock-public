import { PathLike } from 'fs'
import { readFile, writeFile } from '../fs'
import ini, { EncodeOptions } from 'ini'

export type IniData = string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView>

export const DefaultIniPath = './config.ini'

export async function readIni(path: PathLike = DefaultIniPath, ...args: any[]) {
  const data = await readFile(path || './config.ini', ...args)
  return ini.parse(data)
}

export function writeIni(path: PathLike, data: IniData, options?: EncodeOptions | string, ...args: any[]) {
  return writeFile(path, ini.stringify(data, options), ...args)
}
