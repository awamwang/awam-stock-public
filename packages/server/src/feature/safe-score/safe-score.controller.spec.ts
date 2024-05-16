import { Test, TestingModule } from '@nestjs/testing'
import { SafeScoreController } from './safe-score.controller'

describe('SafeScoreController', () => {
  let controller: SafeScoreController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SafeScoreController],
    }).compile()

    controller = module.get<SafeScoreController>(SafeScoreController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
