import { Test, TestingModule } from '@nestjs/testing'
import { SafeScoreService } from './safe-score.service'

describe('SafeScoreService', () => {
  let service: SafeScoreService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SafeScoreService],
    }).compile()

    service = module.get<SafeScoreService>(SafeScoreService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
