import { join } from 'node:path'
import { config as envConfig } from 'dotenv'
import Router from 'koa-router'
import { createProxyMiddleware } from 'http-proxy-middleware'
import koa2_connect from '../libs/koa2-connect'

// 从前端包目录加载 env，避免 electron 运行时 cwd 导致读不到配置
const frontEnvDir = join(__dirname, '../../../envs')
envConfig({ path: join(frontEnvDir, '.env'), override: true })
envConfig({ path: join(frontEnvDir, '.env.local'), override: true })
const nodeEnv = process.env.NODE_ENV || 'development'
envConfig({ path: join(frontEnvDir, `.env.${nodeEnv}`), override: true })
envConfig({ path: join(frontEnvDir, `.env.${nodeEnv}.local`), override: true })

export const serverHost = (process.env.VITE_SERVER_IP || 'stock.awam.wang').trim()
export const serverPort = process.env.VITE_SERVER_PORT || 7001
export const apiPrefix = process.env.VITE_API_PREFIX || '/api/v1'

const isLocalHost = serverHost === 'localhost' || serverHost === '127.0.0.1'
// 本地 Nest 为 http；远程才走 https（此前 https 连本地会 EPROTO）
const ApiUrl = `${isLocalHost ? 'http' : 'https'}://${serverHost}:${serverPort}`
console.log('[proxy] api target:', ApiUrl)

function isGetRequest(req: any) {
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(req.method)
}

let csrfToken: string
const apiProxyMiddleware = koa2_connect(
  createProxyMiddleware({
    target: ApiUrl,
    // koa router 已按前缀匹配，这里再按路径过滤一次
    pathFilter: (pathname) => pathname.startsWith(apiPrefix),
    // 保存cookie中的csrfToken
    on: {
      error(err, req, res) {
        if (res && !res.headersSent && typeof (res as any).writeHead === 'function') {
          ;(res as any).writeHead(500, {
            'Content-Type': 'text/plain',
          })
          ;(res as any).end('Something went wrong. And we are reporting a custom error message.' + err)
        }
      },
      proxyRes(proxyRes, req) {
        if (isGetRequest(req)) {
          const cookies = proxyRes.headers['set-cookie']
          // console.log('cookies', req.method, cookies)
          if (cookies) {
            const csrfTokenCookie = cookies.find((cookie) => cookie.includes('csrfToken'))
            if (csrfTokenCookie) {
              csrfToken = csrfTokenCookie.split(';')[0].split('=')[1]
            }
          }
        }
      },
      proxyReq(proxyReq, req) {
        // 将cookie中的csrfToken添加到请求头中
        if (!isGetRequest(req) && csrfToken) {
          proxyReq.setHeader('CSRF-Token', csrfToken)
          // console.log('csrfToken', csrfToken)
        }
      },
    },
    // cookieDomainRewrite: 'localhost',
    changeOrigin: true,
    ws: true,
    secure: !isLocalHost,
    // logger: console,
  })
)

export function useApiProxyHttpHandler(router: Router) {
  router.all(`${apiPrefix}/(.*)`, apiProxyMiddleware)
}

export default {
  useApiProxyHttpHandler,
}
