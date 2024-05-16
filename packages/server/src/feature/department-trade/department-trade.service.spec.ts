import { Test, TestingModule } from '@nestjs/testing'
import { DepartmentTradeService } from './department-trade.service'

describe('DepartmentTradeService', () => {
  let service: DepartmentTradeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentTradeService],
    }).compile()

    service = module.get<DepartmentTradeService>(DepartmentTradeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
