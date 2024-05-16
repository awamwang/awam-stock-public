import { Test, TestingModule } from '@nestjs/testing'
import { YiDongController } from './yi-dong.controller'

describe('YiDongController', () => {
  let controller: YiDongController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YiDongController],
    }).compile()

    controller = module.get<YiDongController>(YiDongController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
