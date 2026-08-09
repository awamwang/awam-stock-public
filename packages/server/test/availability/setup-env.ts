import fs from 'node:fs'
import path from 'node:path'

/** 保证从 packages/server 加载 envs，并默认使用 pc 环境 */
const serverRoot = path.resolve(__dirname, '../..')

if (process.cwd() !== serverRoot) {
  process.chdir(serverRoot)
}

if (!process.env.AWST_ENV) {
  const pcEnvPath = path.join(serverRoot, 'envs', 'pc.env')
  if (fs.existsSync(pcEnvPath)) {
    process.env.AWST_ENV = 'pc'
  }
}
