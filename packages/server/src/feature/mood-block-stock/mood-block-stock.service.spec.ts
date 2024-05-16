import { Test, TestingModule } from '@nestjs/testing';
import { MoodBlockStockService } from './mood-block-stock.service';

describe('MoodBlockStockService', () => {
  let service: MoodBlockStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoodBlockStockService],
    }).compile();

    service = module.get<MoodBlockStockService>(MoodBlockStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
