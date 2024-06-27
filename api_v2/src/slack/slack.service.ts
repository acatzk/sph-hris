import {
  formatDate,
  getCurrentDate,
  getCurrentTimeDuration,
} from '@/utilities/date.util';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HrisApiService } from '@/hris-api/hris-api.service';
import { SlackMessage } from './slack.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);

  private httpConfig: {
    headers: { Authorization: string; 'Content-Type': string };
  };

  constructor(
    @InjectQueue('slackNotification') private notificationQueue: Queue,
    @InjectQueue('slackInteractivity') private interactivityQueue: Queue,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly hrisApiService: HrisApiService,
    private readonly httpService: HttpService,
  ) {
    const slackOAuthToken = this.configService.get('slackOAuthToken');

    this.initHttpConfig(slackOAuthToken);
  }

  /**
   * Initializes the HTTP configuration with the provided Slack OAuth token.
   *
   * @param {string} slackOAuthToken - The Slack OAuth token used for authorization.
   */
  initHttpConfig(slackOAuthToken: string): void {
    this.httpConfig = {
      headers: {
        Authorization: `Bearer ${slackOAuthToken}`,
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * Retrieves the Slack user IDs for the given HRIS emails.
   *
   * @param {string[]} hrisEmails - An array of HRIS email addresses.
   * @return {Promise<string[]>} - A promise that resolves to an array of Slack user IDs.
   */
  async getSlackUserIds(hrisEmails: string[]): Promise<string[]> {
    const slackEndpoint = 'https://slack.com/api/users.lookupByEmail';
    const slackUserIds = [];

    // const SLACK_RATE_LIMIT_PER_MINUTE = 50;
    // const DELAY_BETWEEN_REQUESTS = 60 * 1000 / SLACK_RATE_LIMIT_PER_MINUTE; // 1200 milliseconds

    for (const hrisEmail of hrisEmails) {
      try {
        const slackUser = await firstValueFrom(
          this.httpService.get(slackEndpoint, {
            ...this.httpConfig,
            params: { email: hrisEmail },
          }),
        ).catch((error) => {
          this.logger.error(error);

          throw error;
        });

        if (slackUser?.data.ok) {
          slackUserIds.push(slackUser.data.user.id);
        }
      } catch (error) {
        const retryAfter =
          parseInt(error.response.headers['retry-after'], 10) * 1000;

        this.logger.warn(
          `Rate limit exceeded. Waiting ${retryAfter / 1000} seconds before retrying.`,
        );

        await new Promise((resolve) => setTimeout(resolve, retryAfter));

        continue;
      }

      // await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
    }

    return slackUserIds;
  }

  /**
   * Composes a slack reminder message for a specific channel/user.
   *
   * @param {string} channelId - The ID of the channel/user to send the reminder to.
   * @return {Promise<SlackMessage>} - A promise that resolves to the composed reminder message.
   */
  async composeReminderMessage(channelId: string): Promise<SlackMessage> {
    const message = {
      channel: channelId,
      text: 'Kindly sending a reminder for you to login for your shift.',
      attachments: [
        {
          fallback: 'Login button',
          callback_id: 'login_button',
          actions: [
            {
              name: 'login',
              text: 'Login',
              type: 'button',
            },
          ],
        },
      ],
    };

    return message;
  }

  /**
   * Sends a message to a Slack channel/user using the provided payload.
   *
   * @param {SlackMessage} payload - The message payload to send.
   * @return {Promise<void>} A promise that resolves when the message has been sent.
   */
  async sendMessage(payload: SlackMessage): Promise<void> {
    const slackEndpoint = 'https://slack.com/api/chat.postMessage';

    await firstValueFrom(
      this.httpService.post(slackEndpoint, payload, this.httpConfig),
    ).catch((error) => this.logger.error(error));
  }

  /**
   * Sends notifications to Slack users based on the HRIS emails obtained from `getEmailsForNotifications`.
   *
   * @return {Promise<void>} A promise that resolves when all notifications have been sent.
   */
  async sendNotifications(): Promise<void> {
    const hrisEmails = await this.hrisApiService.getEmailsForNotifications();

    const slackUserIds = await this.getSlackUserIds(hrisEmails);

    for (const slackUserId of slackUserIds) {
      const reminderMessage = await this.composeReminderMessage(slackUserId);

      const notificationCount =
        (await this.cacheManager.get<number>(
          `notification_count_${slackUserId}`,
        )) ?? 0;

      if (notificationCount < 2) {
        await this.sendMessage(reminderMessage);

        await this.cacheManager.set(
          `notification_count_${slackUserId}`,
          notificationCount + 1,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  /**
   * Formats the user's Slack name to an email address.
   *
   * @param {string} userSlackName - The user's Slack name.
   * @return {Promise<string>} The formatted email address.
   */
  async formatToEmail(userSlackName: string): Promise<string> {
    return userSlackName + '@sun-asterisk.com';
  }

  /**
   * Handles the Slack login process for a user.
   *
   * @param {any} payload - The slack payload from the login button.
   * @return {Promise<void>} - A promise that resolves when the login process is complete.
   */
  async handleSlackLogin(payload: any): Promise<void> {
    if (!payload?.user?.name && !payload?.user?.id) {
      this.logger.error('handleSlackLogin: Invalid payload');
      return;
    }

    const slackUserId = payload.user.id;
    const userEmail = await this.formatToEmail(payload.user.name);
    const userDetails = await this.hrisApiService.getUserByEmail(userEmail);
    console.log(userEmail);
    console.log(userDetails);
    if (!userDetails) {
      await this.sendMessage({
        channel: slackUserId,
        text: 'HRIS user not found.',
      });
      return;
    }

    const { timeEntry, id: userId, employeeSchedule } = userDetails;
    const workingDayTimes = employeeSchedule?.workingDayTimes;

    const latestPreviousTimeEntry =
      await this.hrisApiService.getLatestPreviousTimeEntry(userId);

    if (!timeEntry) {
      await this.sendMessage({
        channel: slackUserId,
        text: 'No existing HRIS time entry found.',
      });
      return;
    }

    if (
      latestPreviousTimeEntry &&
      latestPreviousTimeEntry.timeInId &&
      !latestPreviousTimeEntry.timeOutId
    ) {
      await this.sendMessage({
        channel: slackUserId,
        text: 'Unable to login as you are not logged out for the previous work day.',
      });
      return;
    }

    if (timeEntry.timeIn) {
      await this.sendMessage({
        channel: slackUserId,
        text: 'You are already logged in.',
      });
      return;
    }

    if (!workingDayTimes || workingDayTimes.length === 0) {
      await this.sendMessage({
        channel: slackUserId,
        text: 'No existing HRIS working day times found.',
      });
      return;
    }

    const shiftStartTime = workingDayTimes[0].from;
    const shiftEndTime = workingDayTimes[0].to;
    const formattedDate = formatDate(
      getCurrentDate().toISO() as string,
      'yyyy-MM-dd HH:mm:ss',
    );
    const remarks = 'Logged in from Slack.';

    const formattedDetails = {
      timeIn: {
        id: timeEntry.id,
        userId: userId,
        startTime: shiftStartTime,
        endTime: shiftEndTime,
        date: formattedDate,
        timeHour: getCurrentTimeDuration(),
        remarks,
      },
    };

    await this.hrisApiService.processUserTimeIn(formattedDetails);

    await this.sendMessage({
      channel: slackUserId,
      text: 'Logged in successfully.',
    });
  }

  async registerNotificationSendingJob() {
    await this.notificationQueue.add(
      {},
      { attempts: 3, backoff: 5000, removeOnFail: true },
    );
  }

  async registerInteractivityHandlingJob(payload: any) {
    await this.interactivityQueue.add(
      { payload },
      { attempts: 3, backoff: 5000, removeOnFail: true },
    );
  }
}
