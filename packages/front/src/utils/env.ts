export const isDev = import.meta.env.MODE === 'development'
export const isProd = import.meta.env.MODE === 'production'
export const serverHost = import.meta.env.VITE_SERVER_IP || 'localhost'
export const serverPort = import.meta.env.VITE_SERVER_PORT || 7002
export const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api/v1'
export const FRONT_SOCKET_PORT = import.meta.env.VITE_FRONT_SERVER_SOCKET_PORT || 3001
export const FRONT_HTTP_PORT = import.meta.env.VITE_FRONT_SERVER_HTTP_PORT || 3002

export default {
  isDev,
  serverHost,
  serverPort,
  apiPrefix,
  FRONT_SOCKET_PORT,
  FRONT_HTTP_PORT,
}
