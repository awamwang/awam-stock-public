import { Test, TestingModule } from '@nestjs/testing'
import { MoodBlockItemService } from './mood-block-item.service'

describe('MoodBlockItemService', () => {
  let service: MoodBlockItemService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoodBlockItemService],
    }).compile()

    service = module.get<MoodBlockItemService>(MoodBlockItemService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
