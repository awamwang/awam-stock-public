import fs from 'fs-extra'
import path from 'node:path'

export type PathKind = 'dir' | 'file' | 'writable-file'

export interface PathCheckResult {
  ok: boolean
  reason?: string
}

/** 目录是否存在且可访问 */
export function isExistingDir(target: string): boolean {
  if (!target?.trim()) {
    return false
  }
  try {
    return fs.existsSync(target) && fs.statSync(target).isDirectory()
  } catch {
    return false
  }
}

/** 文件是否存在且可访问 */
export function isExistingFile(target: string): boolean {
  if (!target?.trim()) {
    return false
  }
  try {
    return fs.existsSync(target) && fs.statSync(target).isFile()
  } catch {
    return false
  }
}

/** 目标文件可写：文件已存在，或其父目录存在 */
export function isWritableFilePath(target: string): boolean {
  if (!target?.trim()) {
    return false
  }
  try {
    if (fs.existsSync(target)) {
      return fs.statSync(target).isFile()
    }
    return isExistingDir(path.dirname(target))
  } catch {
    return false
  }
}

export function checkPath(target: string, kind: PathKind): PathCheckResult {
  if (!target?.trim()) {
    return { ok: false, reason: '路径为空' }
  }

  if (kind === 'dir') {
    return isExistingDir(target) ? { ok: true } : { ok: false, reason: `目录不存在或不可访问: ${target}` }
  }

  if (kind === 'file') {
    return isExistingFile(target) ? { ok: true } : { ok: false, reason: `文件不存在或不可访问: ${target}` }
  }

  return isWritableFilePath(target) ? { ok: true } : { ok: false, reason: `文件或其父目录不存在: ${target}` }
}

/**
 * 路径无效时打印跳过日志并返回 true（调用方应直接 return）
 */
export function skipIfPathInvalid(target: string, kind: PathKind, label: string): boolean {
  const result = checkPath(target, kind)
  if (result.ok) {
    return false
  }
  console.warn(`[skip] ${label}：${result.reason}`)
  return true
}
