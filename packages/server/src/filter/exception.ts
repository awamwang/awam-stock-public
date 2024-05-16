import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

import { IFailedResponse } from '@awamstock/shared'

const INTERNAL_ERROR_TEXT = 'Internal Server Error'

@Catch()
// export default class GlobalExceptionFilter implements ExceptionFilter {
export default class GlobalExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    // super.catch(exception, host)
    this.logger.error(exception)
    const ctx = host.switchToHttp()
    // const req = ctx.getRequest()
    // console.log(req.url, req.body, req.headers)
    const response = ctx.getResponse()
    // const request = ctx.getRequest()

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception instanceof HttpException ? exception.message : INTERNAL_ERROR_TEXT

    const resp: IFailedResponse = {
      code: status || HttpStatus.INTERNAL_SERVER_ERROR,
    }

    // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
    // app.emit('error', err, ctx)

    resp.error = process.env.MODE === 'prod' ? INTERNAL_ERROR_TEXT : message
    if (resp.code === 500) {
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
    } else if (resp.code === 422) {
      resp.detail = message
    }

    response.status(200).json(resp)
  }
}
