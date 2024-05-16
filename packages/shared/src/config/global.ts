/**
 * 全局变量
 */
export const UNKNOWN = 'unknown'
export const NONE = 'N/A'
export const OTHER = '其他'

// 用来全局共享变量
export const DATA: Record<string, unknown> = {}

export const SOCKET_EVENTS = {
  clientSetStockCode: 'Client_set_code',
  serverSetStockCode: 'Server_set_code',
  clientMessage: 'Client_message',
  severMessage: 'Server_message',
  dbData: 'Db_data',
  serverData: 'Server_data',
  clientEvent: 'Client_event',
  serverEvent: 'Server_event',
}

export const ERROR_MSG = {
  ERR: 'error',
  OK: 'success',
  DB_INSERT_ERROR: 'db insert error',
  NO_USER: 'no this user',
  NO_AUTH: 'no auth (no userId in jwt token)',
  NO_DB_DATA: 'no data',
  NETWORK_ECONNREFUSED: 'connect error',
}
