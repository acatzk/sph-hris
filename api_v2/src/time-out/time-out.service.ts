import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { TimeOutRequestInput } from '@/graphql/graphql';
import { TimeEntryDTO } from '@/graphql/graphql';
import { TimeEntry } from '@/graphql/graphql';
import { Time } from '@/graphql/graphql';
import { DateTime } from 'luxon';

@Injectable()
export class TimeOutService {
  private readonly logger = new Logger(TimeOutService.name);
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Updates the time out for a given time entry.
   *
   * @param {TimeOutRequestInput} timeout - The time out request input containing the necessary information.
   * @return {Promise<string>} A promise that resolves to a success message if the update is successful.
   * @throws {Error} If the time entry is not found, the worked hours format is invalid, or the tracked hours format is invalid.
   */
  async update(timeout: TimeOutRequestInput): Promise<string> {
    try {
      const currentTime = new Date();
      const timeZoneOffset = currentTime.getTimezoneOffset() * 60000;
      const localTime = new Date(currentTime.getTime() - timeZoneOffset);

      const time = await this.prisma.time.create({
        data: {
          timeHour: localTime,
          remarks: timeout.remarks,
          createdAt: localTime,
          updatedAt: localTime,
        },
      });

      const timeEntry = (await this.prisma.timeEntry.findUnique({
        where: { id: timeout.timeEntryId! },
        include: {
          timeIn: true,
          timeOut: true,
          overtime: true,
          user: {
            select: {
              profileImageId: true,
            },
          },
          workInterruptions: true,
        },
      })) as TimeEntry;

      if (!timeEntry) {
        throw new Error('Time entry not found');
      }

      const workedHours = this.getWorkedHours(timeEntry, time);
      const trackedHours = this.getTrackedHours(timeEntry);

      this.logger.debug(`workedHours: ${workedHours}`);
      this.logger.debug(`trackedHours: ${trackedHours}`);

      // Directly use the formatted workedHours
      if (!this.isValidWorkedHoursFormat(workedHours)) {
        throw new Error('Invalid workedHours value');
      }

      // trackedHours is expected to be DateTime in schema
      if (!DateTime.isDateTime(trackedHours)) {
        throw new Error('Invalid trackedHours value');
      }

      await this.prisma.timeEntry.update({
        where: { id: timeout.timeEntryId! },
        data: {
          timeOut: {
            connect: { id: time.id! },
          },
          workedHours: workedHours, // Use formatted workedHours
          trackedHours: trackedHours.toJSDate(), // Use DateTime directly
        },
      });

      return 'Successful Time Out!';
    } catch (error) {
      this.logger.error(`Failed to update time out: ${error.message}`);
      throw new Error('Something went wrong...');
    }
  }

  /**
   * Calculates the tracked hours for a given time entry.
   *
   * @param {TimeEntry} timeEntry - The time entry to calculate tracked hours for.
   * @return {DateTime} The calculated tracked hours as a DateTime object.
   */
  private getTrackedHours(timeEntry: TimeEntry): DateTime {
    // Fetch or initialize `undertime` and `late` values appropriately
    const timeEntryDto = new TimeEntryDTO();
    const undertime = timeEntryDto.undertime || 0;
    const late = timeEntryDto.late || 0;

    // Convert values to time spans in milliseconds
    const undertimeTimeSpan = this.getTimeSpanFromMinutes(undertime);
    const lateTimeSpan = this.getTimeSpanFromMinutes(late);

    // Ensure endTime and startTime are Date objects
    const scheduledHours =
      timeEntry.endTime.getTime() - timeEntry.startTime.getTime();

    this.logger.debug(`scheduledHours (ms): ${scheduledHours}`);
    this.logger.debug(`undertime (minutes): ${undertime}`);
    this.logger.debug(`late (minutes): ${late}`);
    this.logger.debug(`undertimeTimeSpan (ms): ${undertimeTimeSpan}`);
    this.logger.debug(`lateTimeSpan (ms): ${lateTimeSpan}`);

    const trackedHours = scheduledHours - undertimeTimeSpan - lateTimeSpan;

    // Handle negative trackedHours values
    if (trackedHours < 0) {
      this.logger.error(
        'Tracked hours calculation resulted in a negative value',
      );
      return DateTime.fromMillis(0); // Return a DateTime representing 0 hours
    }

    this.logger.debug(`calculated trackedHours (ms): ${trackedHours}`);

    // Convert trackedHours to a DateTime

    const trackedHoursDateTime = DateTime.fromMillis(trackedHours);

    return trackedHoursDateTime;
  }
  /**
   * Calculates the worked hours between the time entry's time in and time out.
   *
   * @param {TimeEntry} timeEntry - The time entry object containing the time in and time out information.
   * @param {Time} timeOut - The time out object containing the time out information.
   * @return {string} The worked hours in the format "HH:MM:SS". If either the time in or time out is missing, returns "00:00:00".
   */
  private getWorkedHours(timeEntry: TimeEntry, timeOut: Time): string {
    const timeInCreatedAt = timeEntry.timeIn?.createdAt;
    const timeOutCreatedAt = timeOut?.createdAt;

    if (!timeInCreatedAt || !timeOutCreatedAt == null) {
      this.logger.error(
        `Missing timeInCreatedAt or timeOutCreatedAt: timeInCreatedAt=${timeInCreatedAt}, timeOutCreatedAt=${timeOutCreatedAt}`,
      );
      return '00:00:00';
    }

    const start = DateTime.fromJSDate(timeInCreatedAt);
    const end = DateTime.fromJSDate(timeOutCreatedAt);

    const totalTimeSpan = end.diff(start, 'seconds'); // Get total duration in seconds

    const totalSeconds = totalTimeSpan.as('seconds');
    const hours = Math.floor(totalSeconds / 3600); // Total hours
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining minutes
    const seconds = Math.floor(totalSeconds % 60); // Remaining seconds

    // Format hours, minutes, and seconds as strings
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    const workedHours = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    return workedHours;
  }

  /**
   * Converts minutes to milliseconds.
   *
   * @param {number} minutes - The number of minutes to convert.
   * @return {number} The equivalent time span in milliseconds.
   */
  private getTimeSpanFromMinutes(minutes: number): number {
    return minutes * 60 * 1000; // Convert minutes to milliseconds
  }
  /**
   * Checks if the given string is in the valid "HH:MM:SS" format.
   *
   * @param {string} hours - The string to be checked.
   * @return {boolean} Returns true if the string is in the valid format, false otherwise.
   */
  public isValidWorkedHoursFormat(hours: string): boolean {
    // Expect "HH:MM:SS" format
    const workedHoursPattern = /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
    return workedHoursPattern.test(hours);
  }
}
