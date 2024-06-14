import { Test, TestingModule } from '@nestjs/testing';
import { SlackService } from './slack.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { HrisApiService } from '@/hris-api/hris-api.service';
import { HttpService } from '@nestjs/axios';

describe('SlackService', () => {
  let service: SlackService;

  const mockNotificationQueue = {
    add: jest.fn(),
  };

  const mockInteractivityQueue = {
    add: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockHrisApiService = {
    getEmailsForNotifications: jest.fn(),
    getUserByEmail: jest.fn(),
    processUserTimeIn: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlackService,
        {
          provide: 'BullQueue_slackNotification',
          useValue: mockNotificationQueue,
        },
        {
          provide: 'BullQueue_slackInteractivity',
          useValue: mockInteractivityQueue,
        },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HrisApiService, useValue: mockHrisApiService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<SlackService>(SlackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
