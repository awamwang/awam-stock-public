import { app, BrowserWindow, ipcMain } from 'electron'
import { release } from 'os'
import log from 'electron-log'

// import './menu'
import useDev from '../dev'
import createStockWindow, { onChildWindow, onWindowClose, onSecondInstance } from './stock-window'

useDev({
  log,
})

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

app.whenReady().then(() => {
  createStockWindow()

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
      allWindows[0].show()
    } else {
      createStockWindow()
    }
  })
})

// new window example arg: new windows url
ipcMain.handle('open-win', onChildWindow)

app.on('window-all-closed', onWindowClose)
app.on('second-instance', onSecondInstance)
