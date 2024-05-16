import { config as envConfig } from 'dotenv'

export const EnvDir = 'envs'
export type EnvMode = 'development' | 'production' | 'test'

function loadEnvByMode(mode?: EnvMode, type = '') {
  const modeSuffix = mode ? '.' + mode : ''

  envConfig({ path: `${EnvDir}/${type}.env${modeSuffix}`, override: true })
  envConfig({ path: `${EnvDir}/${type}.env${modeSuffix}.local`, override: true })
}

// 实现vite的env机制
loadEnvByMode() // 默认加载.env和.env.local
loadEnvByMode(process.env.NODE_ENV as EnvMode) // 按mode加载env
if (process.env.AWST_ENV) {
  loadEnvByMode(undefined, process.env.AWST_ENV) // 默认加载type.env和type.env.local
  loadEnvByMode(process.env.NODE_ENV as EnvMode, process.env.AWST_ENV) // 按mode加载env
}

export * from './global'
import * as globals from './global'

/**
 * db配置
 */
const DB_NAME = process.env.AWST_DBNAME || 'awamstock'
const USER = process.env.AWST_DBUSER || 'root'
const IP = process.env.AWST_DBIP || 'localhost'
const PORT = process.env.AWST_DBPORT || 27017
const PASSWD = process.env.AWST_DBPASSWD || '123456'
const DB_URL = `mongodb://${USER}:${PASSWD}@${IP}:${PORT}/${DB_NAME}?authMechanism=SCRAM-SHA-256&authSource=admin`
const DB_SHORT_URL = `mongodb://${IP}:${PORT}/${DB_NAME}`

export const db = {
  name: DB_NAME,
  url: DB_URL,
  shortUrl: DB_SHORT_URL,
  options: null,
}

/**
 * server配置
 */
export const server = {
  port: process.env.AWST_SERVER_PORT || 7001,
}

/**
 * front配置
 */
const FRONT_PORT = process.env.AWST_FRONT_PORT || 3000
const FRONT_URL = `http://localhost:${FRONT_PORT}`

export const front = {
  port: FRONT_PORT,
  url: FRONT_URL,
}

/**
 * api配置
 */
const BASE_URL = {
  LongTou: 'https://apphq.longhuvip.com/w1/api/index.php',
  tusahre: 'http://api.tushare.pro',
  baoerFlash: 'https://flash-api.xuangubao.cn',
  baoer: 'https://api.xuangubao.cn',
  eastmoney: 'https://push2.eastmoney.com/api',
  aktools: 'http://127.0.0.1:8988',
  stocksoftLink: 'http://172.28.0.1:8081',
}
export const api = {
  apiPrefix: process.env.AWST_API_PREFIX || 'api/v1',
  baseUrl: BASE_URL,
  headers: {
    baoer: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      origin: 'https://xuangubao.cn',
      referer: 'https://xuangubao.cn/dingpan',
      'sec-ch-ua': '" Not;A Brand";v="99", "Microsoft Edge";v="103", "Chromium";v="103"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': 'Windows',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Edg/103.0.1264.62',
    },
  },
}

/**
 * file配置
 */
const FILE_DIR = process.env.AWST_FILE_DIR || '/var/stock/files'
export const files = {
  tdxDir: `${process.env.AWST_TDX_DIR || 'C:\\Program Files\\通达信'}`,
  thsDir: `${process.env.AWST_THS_DIR || 'C:\\同花顺软件\\同花顺'}`,
  riskyLonghu: `${FILE_DIR}/ths/龙虎危险.txt`,
  departmentTradeInput: `${FILE_DIR}/ths/wencai/营业部龙虎榜.txt`,
  departmentTrade: `${FILE_DIR}/营业部龙虎榜.txt`,
  safeScoreTdx: `${FILE_DIR}/tdx/安全分排行.xls`,
}

/**
 * db data获取
 */
export const TIMEZONE = 'Asia/Shanghai'
export const TUSHARE_TOKEN = process.env.TUSHARE_TOKEN || ''
export const BAOER_TOKEN = process.env.BAOER_TOKEN || ''
export const LONG_TOU_USERID = process.env.LONG_TOU_USERID || ''
export const LONG_TOU_TOKEN = process.env.LONG_TOU_TOKEN || ''
export const EAST_MONEY_TOKEN = process.env.EAST_MONEY_TOKEN || ''

/**
 * front
 */
export const FRONT_SERVER_SOCKET_PORT = process.env.VITE_FRONT_SERVER_SOCKET_PORT ? parseInt(process.env.VITE_FRONT_SERVER_SOCKET_PORT) : 3001
export const FRONT_SERVER_HTTP_PORT = process.env.VITE_FRONT_SERVER_HTTP_PORT ? parseInt(process.env.VITE_FRONT_SERVER_HTTP_PORT) : 3002

export default {
  db,
  api,
  server,
  front,
  files,
  TIMEZONE,
  ...globals,
}
