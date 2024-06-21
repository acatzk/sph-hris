import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { HttpModule } from '@nestjs/axios';
import { HrisApiModule } from '@/hris-api/hris-api.module';
import { SlackController } from './slack.controller';
import { BullModule } from '@nestjs/bull';
import { BullConfigService } from 'config/bull.config';
import { SlackNotificationConsumer } from './slack-notification.processor';
import { SlackInteractivityConsumer } from './slack-interactivity.processor';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    BullModule.registerQueueAsync(
      {
        name: 'slackNotification',
        useClass: BullConfigService,
      },
      {
        name: 'slackInteractivity',
        useClass: BullConfigService,
      },
    ),
    HrisApiModule,
  ],
  providers: [
    SlackService,
    SlackNotificationConsumer,
    SlackInteractivityConsumer,
  ],
  exports: [SlackService],
  controllers: [SlackController],
})
export class SlackModule {}
