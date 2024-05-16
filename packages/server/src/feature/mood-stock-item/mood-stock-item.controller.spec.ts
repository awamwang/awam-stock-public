import { Test, TestingModule } from '@nestjs/testing'
import { MoodStockItemController } from './mood-stock-item.controller'

describe('MoodStockItemController', () => {
  let controller: MoodStockItemController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoodStockItemController],
    }).compile()

    controller = module.get<MoodStockItemController>(MoodStockItemController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
