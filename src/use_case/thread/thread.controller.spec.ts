import { Test, TestingModule } from '@nestjs/testing';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';

describe('ThreadController', () => {
  let controller: ThreadController;
  let service: ThreadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadController],
      providers: [
        {
          provide: ThreadService,
          useValue: {
            addthread: jest.fn(),
            removethread: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ThreadController>(ThreadController);
    service = module.get<ThreadService>(ThreadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call addthread method of ThreadService', async () => {
    const addThreadDto = { threadID: 1, threadName: 'Test Thread' };
    await controller.thread(addThreadDto);
    expect(service.addthread).toHaveBeenCalledWith(addThreadDto);
  });

  it('should call removethread method of ThreadService', async () => {
    const removeThreadDto = { threadID: 1 };
    await controller.remove_thread(removeThreadDto);
    expect(service.removethread).toHaveBeenCalledWith(removeThreadDto);
  });
});