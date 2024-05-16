import { Test, TestingModule } from '@nestjs/testing'
import { FocusedDepartmentService } from './focused-department.service'

describe('FocusedDepartmentService', () => {
  let service: FocusedDepartmentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FocusedDepartmentService],
    }).compile()

    service = module.get<FocusedDepartmentService>(FocusedDepartmentService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
