import { Test, TestingModule } from '@nestjs/testing'
import { TradeCalendarService } from './trade-calendar.service'

describe('TradeCalendarService', () => {
  let service: TradeCalendarService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeCalendarService],
    }).compile()

    service = module.get<TradeCalendarService>(TradeCalendarService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
