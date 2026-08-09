import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import config from '@awamstock/shared/config'

import { AppModule } from '../../src/app.module'

/** 基础列表接口：验证路由可访问且 Mongo 查询可用 */
const LIST_ENDPOINTS = [
  'trade-calendars',
  'stocks',
  'blocks',
  'block-days',
  'environments',
  'global-configs',
  'global-markets',
  'before-open-stocks',
  'stock-pools',
  'mood-blocks',
  'mood-stocks',
  'mood-block-stocks',
  'market-messages',
  'radars',
  'yi-dongs',
  'safe-scores',
  'department-trades',
  'focused-departments',
  'risky-longhus',
  'flows',
] as const

/** 额外业务接口 */
const EXTRA_ENDPOINTS = ['stocks/ding-pan', 'flows/longhu'] as const

describe('本地服务接口可用性', () => {
  let app: INestApplication
  let apiPrefix: string

  beforeAll(async () => {
    apiPrefix = config.api.apiPrefix.replace(/^\/+|\/+$/g, '')

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix(apiPrefix)
    await app.init()
  })

  afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  it.each(LIST_ENDPOINTS)('GET /%s 应返回 200 且包含 data', async (resource) => {
    const res = await request(app.getHttpServer()).get(`/${apiPrefix}/${resource}`).query({ _limit: 1 })

    expect(res.status).toBe(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
      })
    )
  })

  it.each(EXTRA_ENDPOINTS)('GET /%s 应返回 200 且包含 data', async (resource) => {
    const res = await request(app.getHttpServer()).get(`/${apiPrefix}/${resource}`).query({ _limit: 1 })

    expect(res.status).toBe(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
      })
    )
  })
})
