import { existsSync } from 'fs'
import { join } from 'path'
import { app, BrowserWindow, shell, ipcMain, IpcMainInvokeEvent, utilityProcess, UtilityProcess } from 'electron'
import log from 'electron-log'

import { useVueDevTool } from '../dev'
import handleUpdate from '../update/index'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '../..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: BrowserWindow | null = null
let server: UtilityProcess | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const defaultUrl = `${process.env['VITE_DEV_SERVER_URL']}`.slice(0, -1)
const defaultHash = 'board/ding-pan'
const indexHtml = join(ROOT_PATH.dist, 'index.html')

export function loadPage(win: BrowserWindow, options: { url: string; hash?: string }) {
  const { url, hash = '' } = options
  if (!url) return

  if (app.isPackaged) {
    win.loadFile(indexHtml, { hash })
  } else {
    win.loadURL(hash ? `${url}/#${hash}` : url)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
}

/** 解析 front-server 入口；打包后优先使用 asar.unpacked，供 utilityProcess.fork */
function resolveServerEntry() {
  const packagedPath = join(ROOT_PATH.public, 'server/index.js')
  if (!app.isPackaged) {
    return packagedPath
  }
  const unpackedPath = packagedPath.replace(/app\.asar([\\/])/, 'app.asar.unpacked$1')
  if (existsSync(unpackedPath)) {
    return unpackedPath
  }
  return packagedPath
}

/** 解析 front 包 envs 目录；安装包走 extraResources */
function resolveEnvsDir() {
  if (app.isPackaged) {
    return join(process.resourcesPath, 'envs')
  }
  return join(__dirname, '../../../envs')
}

function createServer() {
  const serverEntry = resolveServerEntry()
  const nodeEnv = app.isPackaged ? 'production' : process.env.NODE_ENV || 'development'
  const envsDir = resolveEnvsDir()
  log.info(`[front-server] starting: ${serverEntry} (packaged=${app.isPackaged}, NODE_ENV=${nodeEnv})`)
  log.info(`[front-server] envs dir: ${envsDir}`)

  if (!existsSync(serverEntry)) {
    log.error(`[front-server] entry not found: ${serverEntry}`)
    return
  }
  if (!existsSync(envsDir)) {
    log.error(`[front-server] envs dir not found: ${envsDir}`)
  }

  // 以 front 包根目录为 cwd；安装包用 resources，便于相对路径兜底
  const frontRoot = app.isPackaged ? process.resourcesPath : join(__dirname, '../../..')
  try {
    server = utilityProcess.fork(serverEntry, [], {
      cwd: frontRoot,
      env: {
        ...process.env,
        NODE_ENV: nodeEnv,
        AWAM_FRONT_ENVS_DIR: envsDir,
      },
      stdio: 'pipe',
    })
  } catch (err) {
    log.error(`[front-server] fork failed: ${err instanceof Error ? err.stack || err.message : String(err)}`)
    return
  }

  server.on('spawn', () => {
    log.info(`[front-server] spawned pid=${server?.pid ?? 'unknown'}`)
  })
  server.stdout?.on('data', (data) => {
    log.info(`[front-server] ${String(data).trimEnd()}`)
  })
  server.stderr?.on('data', (data) => {
    log.error(`[front-server] ${String(data).trimEnd()}`)
  })
  server.on('exit', (code) => {
    log.error(`[front-server] exited with code ${code}`)
  })
}

export default async function createWindow() {
  await useVueDevTool()

  win = new BrowserWindow({
    title: '股软',
    icon: join(ROOT_PATH.public, 'favicon.ico'),
    width: 800,
    height: 1500,
    // frame: false, //是否显示窗口边框
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true,
    },
  })

  handleUpdate({
    // url: 'http://xxx.xxx.xxx.xxx:7002/front/packages/update',
    ipcMain,
    mainWindow: win,
    log,
  })

  loadPage(win, { url: defaultUrl, hash: defaultHash })

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // win.webContents.openDevTools()
  createServer()
}

export function onChildWindow(__event: IpcMainInvokeEvent, hash: string) {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  })

  loadPage(childWindow, { url: defaultUrl, hash })
}

export function onWindowClose() {
  win = null
  if (process.platform !== 'darwin') app.quit()
  server?.kill()
}

export function onSecondInstance() {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
}
