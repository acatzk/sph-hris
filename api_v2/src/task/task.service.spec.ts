import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SlackService } from '@/slack/slack.service';

describe('TaskService', () => {
  let service: TaskService;

  const mockSlackService = {
    registerNotificationSendingJob: jest.fn(),
    registerInteractivityHandlingJob: jest.fn(),
  };

  const mockCacheManager = {
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: SlackService,
          useValue: mockSlackService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
