import fs, { PathLike, WriteFileOptions } from 'fs-extra'
import { IconvEncoding, decode, encode } from './encoder'

export async function readFile(path: PathLike, encoding: IconvEncoding = 'utf8', fileOptions: { flag?: string | undefined } = {}): Promise<string> {
  // 这里将读取结果识别成Buffer类型，绕过encode重载的类型定义（有可能为string或Buffer）
  const buffer = (await fs.readFile(path, fileOptions)) as unknown as Buffer
  return decode(buffer, encoding)
}

export async function writeFile(path: PathLike, data: string | Buffer, encoding: IconvEncoding = 'utf8', fileOptions: WriteFileOptions = {}): Promise<void> {
  // 这里将data识别成string类型，绕过encode重载的类型定义（有可能为string或Buffer）
  const buffer = encode(data as string, encoding)
  return fs.writeFile(path, buffer, fileOptions)
}
