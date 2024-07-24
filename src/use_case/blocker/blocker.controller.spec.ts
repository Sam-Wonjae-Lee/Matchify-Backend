import { Test, TestingModule } from '@nestjs/testing';
import { BlockerController } from './blocker.controller';

describe('BlockerController', () => {
  let controller: BlockerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockerController],
    }).compile();

    controller = module.get<BlockerController>(BlockerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
