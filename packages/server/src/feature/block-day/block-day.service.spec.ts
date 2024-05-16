import { Test, TestingModule } from '@nestjs/testing'
import { BlockDayService } from './block-day.service'

describe('BlockDayService', () => {
  let service: BlockDayService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockDayService],
    }).compile()

    service = module.get<BlockDayService>(BlockDayService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
