#!/usr/bin/env node
/**
 * 最简 ths-linker WebSocket 监听脚本
 *
 * 用法:
 *   pnpm test:ths-linker
 *   node scripts/ths-linker-listen.mjs
 *   node scripts/ths-linker-listen.mjs ws://127.0.0.1:8765
 *
 * 依赖: Node >= 20（内置 WebSocket）
 * 前置: ths-linker 已启动且勾选「启用联动」并开始监听
 *
 * 若本脚本能看到 STOCK*，说明 ths-linker 推送正常，问题在前端响应链路。
 */

try {
  // Windows 控制台尽量按 UTF-8 输出中文路径
  if (process.platform === 'win32') {
    process.stdout.setDefaultEncoding?.('utf8')
  }
} catch {
  // ignore
}

const url = process.argv[2] || 'ws://127.0.0.1:8765'
const RECONNECT_MS = 3000

let ws
let closing = false
let lastCode = ''

function now() {
  return new Date().toISOString().replace('T', ' ').replace('Z', '')
}

function log(...args) {
  console.log(`[${now()}]`, ...args)
}

function connect() {
  if (closing) return
  log('connecting', url)
  ws = new WebSocket(url)

  ws.addEventListener('open', () => {
    log('connected')
    ws.send(JSON.stringify({ type: 'list' }))
  })

  ws.addEventListener('message', (ev) => {
    let msg
    try {
      msg = JSON.parse(String(ev.data))
    } catch {
      log('raw', ev.data)
      return
    }

    if (msg.type === 'stock') {
      const changed = msg.code !== lastCode
      lastCode = msg.code || ''
      log(changed ? 'STOCK*' : 'stock', msg.code, msg.symbol || '', msg.ths_dir || '')
      return
    }

    if (msg.type === 'instances') {
      const n = Array.isArray(msg.instances) ? msg.instances.length : 0
      const stocks = msg.stocks && typeof msg.stocks === 'object' ? msg.stocks : {}
      const codes = Object.entries(stocks)
        .map(([dir, info]) => `${info?.code || '?'}@${dir}`)
        .join(' | ')
      log('instances', `count=${n}`, codes || '(no cached stocks)')
      for (const inst of msg.instances || []) {
        log(
          '  -',
          `id=${inst.id}`,
          `listen=${inst.listen}`,
          `send=${inst.send}`,
          inst.title || '',
          inst.ths_dir || ''
        )
      }
      return
    }

    if (msg.type === 'jump_result') {
      log('jump_result', msg.ok ? 'ok' : 'fail', msg.code || '', msg.error || '')
      return
    }

    log('message', msg.type || 'unknown', JSON.stringify(msg))
  })

  ws.addEventListener('error', () => {
    // close 事件会接着触发；这里只提示一次
    log('error (will reconnect if closed)')
  })

  ws.addEventListener('close', () => {
    log('disconnected')
    ws = undefined
    if (closing) return
    setTimeout(connect, RECONNECT_MS)
  })
}

function shutdown() {
  closing = true
  try {
    ws?.close()
  } catch {
    // ignore
  }
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

log('ths-linker listen test')
log('switch stocks in 同花顺; lines marked STOCK* mean code changed')
connect()
