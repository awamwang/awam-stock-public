import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const children = []
let shuttingDown = false

function run(label, args, env = {}) {
  const child = spawn('pnpm', args, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...env },
  })
  child.on('exit', (code, signal) => {
    if (shuttingDown) return
    if (signal) {
      shuttingDown = true
      process.kill(process.pid, signal)
      return
    }
    if (code && code !== 0) {
      console.error(`[dev:vue:${label}] 退出码 ${code}`)
      shutdown(code)
    }
  })
  children.push(child)
  return child
}

function runOnce(label, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('pnpm', args, {
      cwd: root,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, ...env },
    })
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`[dev:vue:${label}] 被信号中断: ${signal}`))
        return
      }
      if (code && code !== 0) {
        reject(new Error(`[dev:vue:${label}] 退出码 ${code}`))
        return
      }
      resolve()
    })
  })
}

function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) {
    if (!child.killed) child.kill()
  }
  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

async function main() {
  run('serve', ['exec', 'ts-node', '-P', 'tsconfig.server.json', '-r', 'tsconfig-paths/register', 'src/server/index.ts'], {
    NODE_ENV: 'development',
  })

  await runOnce('build-server', ['run', 'build:server'], { NO_ELECTRON: 'true' })
  if (shuttingDown) return

  run('vite', ['exec', 'vite'], { NO_ELECTRON: 'true', NODE_ENV: 'development' })
}

main().catch((err) => {
  console.error(err.message || err)
  shutdown(1)
})
