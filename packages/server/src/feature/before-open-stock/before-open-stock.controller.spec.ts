import { Test, TestingModule } from '@nestjs/testing'
import { BeforeOpenStockController } from './before-open-stock.controller'

describe('BeforeOpenStockController', () => {
  let controller: BeforeOpenStockController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeforeOpenStockController],
    }).compile()

    controller = module.get<BeforeOpenStockController>(BeforeOpenStockController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
