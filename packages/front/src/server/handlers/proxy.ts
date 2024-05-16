import Router from 'koa-router'
import { createProxyMiddleware } from 'http-proxy-middleware'
import koa2_connect from '../libs/koa2-connect'

import '@awamstock/shared/config'
export const serverHost = process.env.VITE_SERVER_IP || 'stock.awam.wang'
export const serverPort = process.env.VITE_SERVER_PORT || 7001
export const apiPrefix = process.env.VITE_API_PREFIX || '/api/v1'

const ApiUrl = `https://${serverHost}:${serverPort}`

function isGetRequest(req: any) {
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(req.method)
}

let csrfToken: string
const apiProxyMiddleware = koa2_connect(
  createProxyMiddleware(apiPrefix, {
    target: ApiUrl,
    // pathRewrite: {
    //   '^/v1': '/api/v1',
    // },
    // 保存cookie中的csrfToken
    onError(err, req, res) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      })
      res.end('Something went wrong. And we are reporting a custom error message.' + err)
    },
    onProxyRes: (proxyRes, req, res) => {
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
    // 将cookie中的csrfToken添加到请求头中
    onProxyReq: (proxyReq, req, res) => {
      if (!isGetRequest(req) && csrfToken) {
        proxyReq.setHeader('CSRF-Token', csrfToken)
        // console.log('csrfToken', csrfToken)
      }
    },
    // cookieDomainRewrite: 'localhost',
    changeOrigin: true,
    ws: true,
    secure: true,
    // logLevel: 'debug',
  })
)

export function useApiProxyHttpHandler(router: Router) {
  router.all(`${apiPrefix}/(.*)`, apiProxyMiddleware)
}

export default {
  useApiProxyHttpHandler,
}
