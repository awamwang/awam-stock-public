import { RequestHandler } from 'http-proxy-middleware'
import { Context, Next } from 'koa'

export interface MyRequestHandler {
  (req: any, res: any, next?: any, other?: any): void
}

const CallerProps = ['setHeader', 'writeHead', 'write', 'end'] as const
// type ICallerProps = typeof CallerProps[number]
const TextProps = ['statusCode', 'statusMessage'] as const
// type ITextProps = typeof TextProps[number]

/**
 * Inject raw response, so we can know if middleware has responsed.
 */
function makeInjectedResponse(koaCtx: Context, /*markHandled,*/ whenEnded: () => void) {
  const res = koaCtx.res

  res.on('close', whenEnded).on('finish', whenEnded)

  const dummyRes = Object.create(res)
  CallerProps.forEach((name) => {
    dummyRes[name] = function (...args: any[]) {
      if (!res) return
      ;(res[name] as CallableFunction)(...args)
      // koa2.0 initial assign statusCode to 404, reset to 200
      if (res.statusCode === 404) {
        res.statusCode = 200
      }
      // markHandled();
    }
  })
  TextProps.forEach((name) => {
    dummyRes.__defineSetter__(name, function (value: string | number) {
      if (!res) return
      ;(res[name] as string | number) = value
      // markHandled();
    })
  })

  return dummyRes
}

/**
 * The middleware function does include the `next` callback so only resolve
 * the Promise when it's called. If it's never called, the middleware stack
 * completion will stall
 */
function handler(ctx: Context, connectMiddleware: MyRequestHandler) {
  return new Promise((resolve, reject) => {
    // let hasHandled = false;
    const injectResponse = makeInjectedResponse(
      ctx,
      // () => {
      //   // hasHandled = true;
      // },
      () => {
        resolve(false)
      }
    )
    const resolvePromise = (err: any) => {
      if (err) reject(err)
      else resolve(true)
    }

    let assumeSync = true
    if (connectMiddleware.length < 3) {
      // (req, res)
      connectMiddleware(ctx.req as any, injectResponse, null as any)
    } else if (connectMiddleware.length >= 3) {
      // (req, res, next) or (err, req, res, next)
      connectMiddleware(ctx.req as any, injectResponse, resolvePromise)
      assumeSync = false
    } else if (connectMiddleware.length >= 4) {
      // (err, req, res, next)
      connectMiddleware(null, ctx.req as any, injectResponse, resolvePromise as any)
    }

    /**
     * If the middleware function does not declare receiving the `next` callback
     * assume that it's synchronous.
     */
    if (assumeSync /*&& !hasHandled*/) {
      resolve(true)
    }
  })
}

/**
 * Returns a Koa middleware function that varies its async logic based on if the
 * given middleware function declares at least 3 parameters, i.e. includes
 * the `next` callback function
 */
function koaConnect(connectMiddleware: MyRequestHandler) {
  return async (ctx: Context, next: Next) => {
    ctx.respond = false
    try {
      const goNext = await handler(ctx, connectMiddleware)
      if (goNext) {
        ctx.respond = true
        return next()
      }
    } catch (err) {
      ctx.respond = true
      throw err
    }
  }
}

export default koaConnect
