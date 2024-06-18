import { Body, Controller, Post } from '@nestjs/common';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  /**
   * Parses the payload from slack and registers a job to handle the interactivity.
   *
   * @param {Object} parameters - The request parameters containing the payload.
   * @param {string} parameters.payload - The payload to be parsed.
   * @return {Promise<string>} A promise that resolves to a message indicating the status of the login request.
   */
  @Post('handle-interactivity')
  async handleInteractivity(
    @Body() parameters: { payload: string },
  ): Promise<string> {
    if (!parameters) {
      return 'Something went wrong. Please try again later.';
    }

    const parsedPayload = JSON.parse(parameters.payload);

    await this.slackService.registerInteractivityHandlingJob(parsedPayload);

    return 'Login request is currently being processed. Sending feedback in a while...';
  }
}
