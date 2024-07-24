import { Test, TestingModule } from '@nestjs/testing';
import { BlockerService } from './blocker.service';

describe('BlockerService', () => {
  let service: BlockerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockerService],
    }).compile();

    service = module.get<BlockerService>(BlockerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
