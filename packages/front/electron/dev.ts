import { ElectronLog } from 'electron-log'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'

const isDevelopment = process.env.NODE_ENV !== 'production'

process.traceProcessWarnings = isDevelopment
export async function useVueDevTool() {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS.id)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e)
      // console.error('Vue Devtools failed to install:', e.toString())
    }
  }
}

function useLog(log: ElectronLog) {
  log.transports.file.level = 'info'
  log.info('App starting...')

  if (isDevelopment) {
    log.transports.file.level = 'debug'
    log.debug('App is running in development mode.')
  }
}

export default async function useDev(options: { log: ElectronLog }) {
  const { log } = options

  useLog(log)
}
