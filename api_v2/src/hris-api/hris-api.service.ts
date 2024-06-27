import {
  formatDate,
  getCurrentDate,
  isBetweenTime,
} from '@/utilities/date.util';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { AuthTokenService } from '@/auth-token/auth-token.service';
import { TimeEntry, TimeInRequest, User } from './hris.api.interface';
import { HttpHeaders } from '@/shared/shared.interface';
import {
  getLatestPreviousTimeEntry,
  getTimeEntriesQuery,
  getUserByEmailQuery,
  timeInMutation,
} from './hri-api-graphl.constants';

@Injectable()
export class HrisApiService {
  private readonly logger = new Logger(HrisApiService.name);

  private hrisApiGraphQLEndpoint: string;

  constructor(
    private readonly authTokenService: AuthTokenService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.hrisApiGraphQLEndpoint = this.configService.get(
      'hrisApiGraphQLEndpoint',
    ) as string;
  }

  /**
   * Retrieves the HTTP configuration with the provided auth token.
   *
   * @param {string} authToken - The authorization token.
   * @return {Promise<HttpHeaders>} The HTTP headers configuration.
   */
  async getHttpConfig(authToken: string): Promise<HttpHeaders> {
    return {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * Fetches time entries for the current day from the HRIS API.
   *
   * @return {Promise<TimeEntry[]>} A promise that resolves to an array of time entries.
   */
  async fetchTimeEntries(): Promise<TimeEntry[]> {
    const dateToday = formatDate(
      getCurrentDate().toISO() as string,
      'yyyy-MM-dd',
    );

    const query = getTimeEntriesQuery(dateToday);

    const authToken = await this.authTokenService.getAuthToken();

    const httpConfig = await this.getHttpConfig(authToken);

    const result = await firstValueFrom(
      this.httpService.post(this.hrisApiGraphQLEndpoint, { query }, httpConfig),
    ).catch((error) => this.logger.error(error));

    return result?.data?.data?.timeEntries ?? [];
  }

  /**
   * Retrieves the latest previous time entry for a given user ID.
   *
   * @param {number} userId - The ID of the user.
   * @return {Promise<TimeEntry | null>} A promise that resolves to the latest previous time entry for the user, or null if not found.
   */
  async getLatestPreviousTimeEntry(userId: number): Promise<TimeEntry | null> {
    const query = getLatestPreviousTimeEntry(userId);

    const authToken = await this.authTokenService.getAuthToken();

    const httpConfig = await this.getHttpConfig(authToken);

    const result = await firstValueFrom(
      this.httpService.post(this.hrisApiGraphQLEndpoint, { query }, httpConfig),
    ).catch((error) => this.logger.error(error));

    return result?.data?.data?.latestPreviousTimeEntry ?? null;
  }

  /**
   * Filters the given array of TimeEntry objects based on certain conditions.
   *
   * @param {TimeEntry[]} timeEntries - The array of TimeEntry objects to filter.
   * @return {Promise<TimeEntry[]>} - A promise that resolves to the filtered array of TimeEntry objects.
   */
  async getFilteredTimeEntries(timeEntries: TimeEntry[]): Promise<TimeEntry[]> {
    return timeEntries.filter((timeEntry: TimeEntry) => {
      const timeNow = getCurrentDate().toISO() as string;
      const timeInTwentyMinutes = getCurrentDate()
        .plus({ minutes: 20 })
        .toISO() as string;

      const shiftInTwentyMins = isBetweenTime(
        timeEntry.startTime,
        timeNow,
        timeInTwentyMinutes,
      );

      const pastStartShiftTime =
        formatDate(timeNow, 'HH:mm') >= timeEntry.startTime;

      const notLoggedIn = timeEntry.timeIn ? false : true;

      const onRestDay =
        timeEntry.startTime == '00:00' && timeEntry.endTime == '00:00';

      return (
        notLoggedIn && !onRestDay && (shiftInTwentyMins || pastStartShiftTime)
      );
    });
  }

  /**
   * Maps the email addresses from the given array of time entries.
   *
   * @param {TimeEntry[]} timeEntries - The array of time entries to extract email addresses from.
   * @return {Promise<string[]>} - A promise that resolves to an array of email addresses.
   */
  async getEmailsFromTimeEntries(timeEntries: TimeEntry[]): Promise<string[]> {
    return timeEntries.map(
      (timeEntry: { user: { email: string } }) => timeEntry.user.email,
    );
  }

  /**
   * Retrieves the email addresses for slack notifications.
   *
   * @return {Promise<string[]>} A promise that resolves to an array of email addresses for notifications.
   */
  async getEmailsForNotifications(): Promise<string[]> {
    let timeEntries: TimeEntry[] =
      (await this.cacheManager.get('timeEntries')) ?? [];

    if (!timeEntries || !timeEntries.length) {
      timeEntries = await this.fetchTimeEntries();

      this.cacheManager.set('timeEntries', timeEntries, 43200);
    }

    const filteredTimeEntries = await this.getFilteredTimeEntries(timeEntries);

    return await this.getEmailsFromTimeEntries(filteredTimeEntries);
  }

  /**
   * Retrieves a user by email from the HRIS API.
   *
   * @param {string} email - The email address of the user to retrieve.
   * @return {Promise<User|null>} A promise that resolves to the user object or null if not found.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const query = getUserByEmailQuery(email);

    const authToken = await this.authTokenService.getAuthToken();

    const httpConfig = await this.getHttpConfig(authToken);

    const result = await firstValueFrom(
      this.httpService.post(this.hrisApiGraphQLEndpoint, { query }, httpConfig),
    ).catch((error) => this.logger.error(error));

    return result?.data?.data?.userByEmail;
  }

  /**
   * Processes the user time in by updating the time in for the given TimeInRequest.
   *
   * @param {TimeInRequest} timeInRequest - The TimeInRequest containing the time in information.
   * @return {Promise<void>} A promise that resolves when the time in has been processed.
   */
  async processUserTimeIn(timeInRequest: TimeInRequest): Promise<void> {
    const mutation = timeInMutation();

    const authToken = await this.authTokenService.getAuthToken();

    const httpConfig = await this.getHttpConfig(authToken);

    await firstValueFrom(
      this.httpService.post(
        this.hrisApiGraphQLEndpoint,
        { query: mutation, variables: timeInRequest },
        httpConfig,
      ),
    ).catch((error) => this.logger.error(error));
  }
}
