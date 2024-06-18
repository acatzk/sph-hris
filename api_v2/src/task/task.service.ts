import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { SlackService } from '@/slack/slack.service';

@Injectable()
export class TaskService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly slackService: SlackService,
  ) {}

  /**
   * Registers a job to send Slack notifications.
   *
   * @return {Promise<void>} A promise that resolves when the notification sending job has been registered.
   */
  @Cron('*/20 * * * *')
  async sendSlackNotifications(): Promise<void> {
    await this.slackService.registerNotificationSendingJob();
  }

  /**
   * Resets the cache by clearing all stored data.
   *
   * @return {Promise<void>} A promise that resolves when the cache is successfully reset.
   */
  @Cron('0 8 * * *')
  async resetCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
