import { Test, TestingModule } from '@nestjs/testing'
import { DepartmentTradeController } from './department-trade.controller'

describe('DepartmentTradeController', () => {
  let controller: DepartmentTradeController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentTradeController],
    }).compile()

    controller = module.get<DepartmentTradeController>(DepartmentTradeController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
