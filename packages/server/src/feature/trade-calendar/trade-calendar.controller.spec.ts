import { Test, TestingModule } from '@nestjs/testing'
import { TradeCalendarController } from './trade-calendar.controller'

describe('TradeCalendarController', () => {
  let controller: TradeCalendarController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeCalendarController],
    }).compile()

    controller = module.get<TradeCalendarController>(TradeCalendarController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
