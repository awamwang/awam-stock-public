import { Test, TestingModule } from '@nestjs/testing'
import { BlockDayController } from './block-day.controller'

describe('BlockDayController', () => {
  let controller: BlockDayController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockDayController],
    }).compile()

    controller = module.get<BlockDayController>(BlockDayController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
