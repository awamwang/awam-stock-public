import { Test, TestingModule } from '@nestjs/testing'
import { MarketMessageService } from './market-message.service'

describe('MarketMessageService', () => {
  let service: MarketMessageService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketMessageService],
    }).compile()

    service = module.get<MarketMessageService>(MarketMessageService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
