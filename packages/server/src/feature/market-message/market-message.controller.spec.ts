import { Test, TestingModule } from '@nestjs/testing'
import { MarketMessageController } from './market-message.controller'

describe('MarketMessageController', () => {
  let controller: MarketMessageController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketMessageController],
    }).compile()

    controller = module.get<MarketMessageController>(MarketMessageController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
