import { Test, TestingModule } from '@nestjs/testing'
import { MoodStockItemService } from './mood-stock-item.service'

describe('MoodStockItemService', () => {
  let service: MoodStockItemService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoodStockItemService],
    }).compile()

    service = module.get<MoodStockItemService>(MoodStockItemService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
