import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const skipBuild = process.argv.includes('--skip-build')

const ECOSYSTEM_FILES = [
  'packages/akshare/ecosystem.config.js',
  'packages/db/ecosystem.config.js',
  'packages/server/ecosystem.config.js',
]

const LOG_PATH_KEYS = ['out_file', 'err_file', 'error_file', 'log_file']

function run(label, args) {
  return new Promise((resolve, reject) => {
    console.log(`\n[${label}] pnpm ${args.join(' ')}`)
    const child = spawn('pnpm', args, {
      cwd: root,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    })
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`[${label}] 被信号终止: ${signal}`))
        return
      }
      if (code === 0) {
        resolve()
        return
      }
      reject(new Error(`[${label}] 退出码 ${code}`))
    })
  })
}

/** 从各包 ecosystem 配置中收集日志目录并创建 */
function ensureLogDirs() {
  const dirs = new Set()
  for (const rel of ECOSYSTEM_FILES) {
    const conf = require(join(root, rel))
    for (const app of conf.apps || []) {
      for (const key of LOG_PATH_KEYS) {
        const file = app[key]
        if (typeof file === 'string' && file.trim()) {
          dirs.add(dirname(file))
        }
      }
    }
  }
  for (const dir of dirs) {
    mkdirSync(dir, { recursive: true })
    console.log(`[log] 已确保目录存在: ${dir}`)
  }
}

async function main() {
  if (process.env.AWST_ENV) {
    console.log(`[env] AWST_ENV=${process.env.AWST_ENV}`)
  } else {
    console.warn('[env] 未设置 AWST_ENV，将使用各包 envs 默认加载逻辑')
  }

  ensureLogDirs()

  if (!skipBuild) {
    // 生产启动不打包前端
    await run('build', ['-r', '--filter', '!@awamstock/front', '--if-present', 'build'])
  } else {
    console.log('\n[build] 已跳过 (--skip-build)')
  }

  // 顺序启动：akshare → db → server（均在对应包目录执行 pm2）
  await run('akshare', ['-F', 'akshare', 'run', 'pm2:start'])
  await run('db', ['-F', '@awamstock/db', 'run', 'pm2:start'])
  await run('server', ['-F', '@awamstock/server', 'run', 'pm2:start'])

  console.log('\n[done] 生产进程已通过 PM2 启动/重载')
  console.log('  查看: pm2 ls')
  console.log('  日志: pm2 logs')
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
