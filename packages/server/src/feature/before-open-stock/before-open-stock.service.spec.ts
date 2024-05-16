import { Test, TestingModule } from '@nestjs/testing'
import { BeforeOpenStockService } from './before-open-stock.service'

describe('BeforeOpenStockService', () => {
  let service: BeforeOpenStockService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeforeOpenStockService],
    }).compile()

    service = module.get<BeforeOpenStockService>(BeforeOpenStockService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
