import { Test, TestingModule } from '@nestjs/testing';
import { RequestDecisionController } from './request_decision.controller';

describe('RequestController', () => {
  let controller: RequestDecisionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestDecisionController],
    }).compile();

    controller = module.get<RequestDecisionController>(RequestDecisionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
