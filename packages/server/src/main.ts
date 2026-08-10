import config from '@awamstock/shared/config'

import { Logger, RequestMethod } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import GlobalExceptionFilter from './filter/exception'
// import { LoggingInterceptor } from './interceptor/logging'

import { CommonSubscribeService, GlobalSubscribeService, RecordSubscribeService, BeforeOpenStockSubscribeService } from './reactive/subscribe.module'

const logger = new Logger('app')
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn'],
  })
  // 根路径 /、/health 留给探活，不挂 api 前缀
  app.setGlobalPrefix(config.api.apiPrefix, {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
    ],
  })

  // app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalFilters(new GlobalExceptionFilter())

  app.use(helmet())
  app.use(compression())
  app.use(cookieParser())
  app.enableCors({
    origin: config.front.url,
    credentials: true,
    methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  })

  app.get(CommonSubscribeService)
  app.get(GlobalSubscribeService)
  app.get(RecordSubscribeService)
  app.get(BeforeOpenStockSubscribeService)

  await app.listen(config.server.port || 7001, '0.0.0.0')
  logger.log(`server is running on ${await app.getUrl()}`)
}

bootstrap()
