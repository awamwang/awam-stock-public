import config from '@awamstock/shared/config'

import { Logger } from '@nestjs/common'
import { NestFactory, HttpAdapterHost } from '@nestjs/core'
// import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
// import csurf from 'csurf'

import { AppModule } from './app.module'
import GlobalExceptionFilter from './filter/exception'
// import { LoggingInterceptor } from './interceptor/logging'

import { CommonSubscribeService, GlobalSubscribeService, RecordSubscribeService, BeforeOpenStockSubscribeService, SubscribeModule } from './reactive/subscribe.module'

const logger = new Logger('app')
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn'],
  })
  app.setGlobalPrefix(config.api.apiPrefix)
  // const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  // const { httpAdapter } = app.get(HttpAdapterHost)
  // app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter))
  // app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalFilters(new GlobalExceptionFilter())

  app.use(helmet())
  app.use(compression())
  app.use(cookieParser())
  // app.use(
  //   csurf({
  //     cookie: {
  //       key: 'csrfToken',
  //       secure: true,
  //       domain: config.front.url,
  //       sameSite: 'none',
  //     },
  //   })
  // )
  app.enableCors({
    origin: config.front.url,
    credentials: true,
    methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  })

  // app.get(SubscribeModule)
  app.get(CommonSubscribeService)
  app.get(GlobalSubscribeService)
  app.get(RecordSubscribeService)
  app.get(BeforeOpenStockSubscribeService)

  await app.listen(config.server.port || 7001, '0.0.0.0')
  logger.log(`server is running on ${await app.getUrl()}`)
}

bootstrap()
