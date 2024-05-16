import { BrowserWindow, IpcMain } from 'electron'
import { autoUpdater, UpdateDownloadedEvent } from 'electron-updater'
import { ElectronLog } from 'electron-log'

interface UpdateConfig {
  url?: string
  mainWindow: BrowserWindow
  ipcMain: IpcMain
  log: ElectronLog
}

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function handleUpdate(updateConfig: UpdateConfig) {
  const { url, mainWindow, ipcMain, log } = updateConfig

  // 通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage(text: string) {
    mainWindow.webContents.send('message', text)
  }

  const message = {
    error: 'update error',
    checking: 'updating...',
    updateAva: 'fetch new version and downloading...',
    updateNotAva: 'do not to update',
    downloaded: 'update downloaded',
  }
  // 设置服务器更新地址
  if (url) {
    autoUpdater.setFeedURL({
      provider: 'generic',
      url,
    })
  }
  autoUpdater.on('error', function () {
    log.error(message.error)
    sendUpdateMessage('error')
  })
  autoUpdater.on('checking-for-update', function () {
    log.debug(message.checking)
    sendUpdateMessage('checking-for-update')
  })
  // 版本检测结束，准备更新
  autoUpdater.on('update-available', function (info) {
    log.info(message.updateAva)
    sendUpdateMessage('update-available')
  })
  autoUpdater.on('update-not-available', function (info) {
    log.debug(message.updateNotAva)
    sendUpdateMessage('update-not-available')
  })
  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    log.debug('下载进度百分比>>>', progressObj.percent)
    mainWindow.webContents.send('download-progress', progressObj.percent)
  })
  // 下载完成
  // autoUpdater.on('update-downloaded', function (event: Event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
  autoUpdater.on('update-downloaded', function (event: UpdateDownloadedEvent) {
    log.info(message.downloaded)
    // 退出且重新安装
    sendUpdateMessage('update-downloaded')
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('check-update', () => {
    log.debug('check for update')
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
  })
}
export default handleUpdate
