import { Test, TestingModule } from '@nestjs/testing'
import { MoodBlockItemController } from './mood-block-item.controller'

describe('MoodBlockItemController', () => {
  let controller: MoodBlockItemController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoodBlockItemController],
    }).compile()

    controller = module.get<MoodBlockItemController>(MoodBlockItemController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
