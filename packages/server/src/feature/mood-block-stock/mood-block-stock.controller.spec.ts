import { Test, TestingModule } from '@nestjs/testing';
import { MoodBlockStockController } from './mood-block-stock.controller';

describe('MoodBlockStockController', () => {
  let controller: MoodBlockStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoodBlockStockController],
    }).compile();

    controller = module.get<MoodBlockStockController>(MoodBlockStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
