import fs from 'node:fs'
import path from 'node:path'

/** 保证从 packages/server 加载 envs，并默认使用 pc 环境 */
const serverRoot = path.resolve(__dirname, '../..')
const dbEnvDir = path.resolve(serverRoot, '../db/envs')

if (process.cwd() !== serverRoot) {
  process.chdir(serverRoot)
}

if (!process.env.AWST_ENV) {
  const pcEnvPath = path.join(serverRoot, 'envs', 'pc.env')
  if (fs.existsSync(pcEnvPath)) {
    process.env.AWST_ENV = 'pc'
  }
}

/** 简易 dotenv 解析：不覆盖已有 process.env */
function loadEnvFile(filePath: string, override = false) {
  if (!fs.existsSync(filePath)) {
    return
  }

  const content = fs.readFileSync(filePath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const eq = trimmed.indexOf('=')
    if (eq <= 0) {
      continue
    }

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (override || process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

// 补充加载 db 包环境（第三方 Token 等），不覆盖 server 已配置项
const envType = process.env.AWST_ENV || ''
for (const envPath of [
  path.join(dbEnvDir, '.env'),
  path.join(dbEnvDir, '.env.local'),
  envType ? path.join(dbEnvDir, `${envType}.env`) : '',
  envType ? path.join(dbEnvDir, `${envType}.env.local`) : '',
].filter(Boolean)) {
  loadEnvFile(envPath, false)
}
