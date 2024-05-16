import { Test, TestingModule } from '@nestjs/testing'
import { RiskyLonghuService } from './risky-longhu.service'

describe('RiskyLonghuService', () => {
  let service: RiskyLonghuService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiskyLonghuService],
    }).compile()

    service = module.get<RiskyLonghuService>(RiskyLonghuService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
