import { Test, TestingModule } from '@nestjs/testing'
import { GlobalMarketController } from './global-market.controller'

describe('GlobalMarketController', () => {
  let controller: GlobalMarketController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalMarketController],
    }).compile()

    controller = module.get<GlobalMarketController>(GlobalMarketController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
