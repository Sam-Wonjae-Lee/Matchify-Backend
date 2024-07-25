import { Test, TestingModule } from '@nestjs/testing';
import { RequestDecisionService } from './request_decision.service';

describe('RequestDecisionService', () => {
  let service: RequestDecisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestDecisionService],
    }).compile();

    service = module.get<RequestDecisionService>(RequestDecisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
