import { Test, TestingModule } from '@nestjs/testing';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';

describe('SlackController', () => {
  let controller: SlackController;

  const mockSlackService = {
    initHttpConfig: jest.fn(),
    getSlackUserIds: jest.fn(),
    composeReminderMessage: jest.fn(),
    sendMessage: jest.fn(),
    sendNotifications: jest.fn(),
    formatToEmail: jest.fn(),
    handleSlackLogin: jest.fn(),
    registerNotificationSendingJob: jest.fn(),
    registerInteractivityHandlingJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SlackService,
          useValue: mockSlackService,
        },
      ],
      controllers: [SlackController],
    }).compile();

    controller = module.get<SlackController>(SlackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
