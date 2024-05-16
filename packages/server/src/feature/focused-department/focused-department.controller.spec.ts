import { Test, TestingModule } from '@nestjs/testing'
import { FocusedDepartmentController } from './focused-department.controller'

describe('FocusedDepartmentController', () => {
  let controller: FocusedDepartmentController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FocusedDepartmentController],
    }).compile()

    controller = module.get<FocusedDepartmentController>(FocusedDepartmentController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
