import { Test, TestingModule } from '@nestjs/testing'
import { GlobalMarketService } from './global-market.service'

describe('GlobalMarketService', () => {
  let service: GlobalMarketService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalMarketService],
    }).compile()

    service = module.get<GlobalMarketService>(GlobalMarketService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
