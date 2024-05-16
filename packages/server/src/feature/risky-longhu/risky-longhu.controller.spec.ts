import { Test, TestingModule } from '@nestjs/testing'
import { RiskyLonghuController } from './risky-longhu.controller'

describe('RiskyLonghuController', () => {
  let controller: RiskyLonghuController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiskyLonghuController],
    }).compile()

    controller = module.get<RiskyLonghuController>(RiskyLonghuController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
