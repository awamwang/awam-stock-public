import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const children = []
let shuttingDown = false

function run(label, args) {
  const child = spawn('pnpm', args, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  })
  child.on('exit', (code, signal) => {
    if (shuttingDown) return
    if (signal) {
      shuttingDown = true
      process.kill(process.pid, signal)
      return
    }
    if (code && code !== 0) {
      console.error(`[${label}] 退出码 ${code}`)
      shutdown(code)
    }
  })
  children.push(child)
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

run('db', ['--filter', '@awamstock/db', 'run', 'dev'])
run('server', ['--filter', '@awamstock/server', 'run', 'dev'])
run('front', ['--filter', '@awamstock/front', 'run', 'dev:vue'])
