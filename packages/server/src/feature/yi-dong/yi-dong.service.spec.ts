import { Test, TestingModule } from '@nestjs/testing'
import { YiDongService } from './yi-dong.service'

describe('YiDongService', () => {
  let service: YiDongService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YiDongService],
    }).compile()

    service = module.get<YiDongService>(YiDongService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
