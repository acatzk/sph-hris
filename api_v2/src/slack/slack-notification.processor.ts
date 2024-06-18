import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { SlackService } from './slack.service';
import { Logger } from '@nestjs/common';

@Processor('slackNotification')
export class SlackNotificationConsumer {
  private readonly logger = new Logger(SlackService.name);

  constructor(private readonly slackService: SlackService) {}

  /**
   * Processes the sending of slack notifications
   *
   * @return {Promise<void>} A promise that resolves when the notifications have been sent.
   */
  @Process()
  async processNotificationSending() {
    this.slackService.sendNotifications();
  }

  /**
   * Logs the processing of a job.
   *
   * @param {Job} job - The job being processed.
   * @return {void} This function does not return anything.
   */
  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  /**
   * Logs the completion of a job.
   *
   * @param {Job} job - The completed job.
   * @return {void} This function does not return anything.
   */
  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Completed job ${job.id} of type ${job.name}`);
  }

  /**
   * Logs the failure of a job and the corresponding error.
   *
   * @param {Job} job - The job that failed.
   * @param {Error} error - The error that occurred.
   */
  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.log(`Failed job ${job.id} of type ${job.name}`);
    this.logger.log(error);
  }
}
