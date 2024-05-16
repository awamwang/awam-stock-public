import { Test, TestingModule } from '@nestjs/testing'
import { StockPoolService } from './stock-pool.service'

describe('StockPoolService', () => {
  let service: StockPoolService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockPoolService],
    }).compile()

    service = module.get<StockPoolService>(StockPoolService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
