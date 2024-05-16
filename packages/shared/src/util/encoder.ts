import iconv from 'iconv-lite'

const NodeEncodingList = ['ascii', 'utf8', 'utf-8', 'utf16le', 'ucs2', 'ucs-2', 'base64', 'base64url', 'latin1', 'binary', 'hex'] as const

export type IconvEncoding = typeof NodeEncodingList[number] | string

export function decode(buffer: Buffer, encoding: IconvEncoding = 'utf-8'): string {
  return iconv.decode(buffer, encoding)
}

export function encode(content: string, encoding: IconvEncoding = 'utf-8'): Buffer {
  return iconv.encode(content, encoding)
}
