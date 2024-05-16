import { Test, TestingModule } from '@nestjs/testing'
import { StockPoolController } from './stock-pool.controller'

describe('StockPoolController', () => {
  let controller: StockPoolController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockPoolController],
    }).compile()

    controller = module.get<StockPoolController>(StockPoolController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
