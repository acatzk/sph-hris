import { WorkStatusEnum } from '@/enums/work-status.enum';
import { TimeEntryDTO, User, UserDTO } from '@/graphql/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { TimeEntriesWithRelations } from '@/types/time-record.types';

@Injectable()
export class TimeRecordService {
  constructor(private prisma: PrismaService) {}

  async getTimeEntriesById(id: number): Promise<TimeEntryDTO[]> {
    const timeEntries: TimeEntriesWithRelations[] =
      await this.prisma.timeEntry.findMany({
        where: {
          userId: id,
        },
        include: {
          user: true,
          workInterruptions: true,
          eslChangeShiftRequests: true,
          eslOffsets: true,
          timeIn: true,
          timeOut: true,
        },
      });

    return timeEntries.map((timeEntry) => this.mapTimesheet(timeEntry));
  }

  /**
   * Maps a single employee timesheet from the database model to the DTO.
   *
   * @param {TimeEntry} timeEntry - The timeEntry object from the database.
   * @returns {TimeEntryDTO} The mapped Time Entry DTO.
   */
  private mapTimesheet(timeEntry: any): TimeEntryDTO {
    let workStatus,
      late = 0,
      undertime = 0;
    if (timeEntry.timeIn) {
      workStatus = WorkStatusEnum.ONDUTY;
      //Times are in milliseconds
      late = Math.max(
        0,
        (timeEntry.startTime - timeEntry.timeIn.timeHour) / 60000,
      );
      undertime = Math.max(
        0,
        (timeEntry.endTime - timeEntry.timeOut.timeHour) / 60000,
      );
    } else {
      workStatus = WorkStatusEnum.ABSENT;
    }

    const mappedTimesheet: TimeEntryDTO = {
      ...timeEntry,
      startTime: timeEntry.startTime.toISOString().slice(11, 19),
      endTime: timeEntry.endTime.toISOString().slice(11, 19),
      late: late,
      undertime: undertime,
      eslChangeShift:
        timeEntry.eslChangeShiftRequests.length === 0
          ? null
          : timeEntry.eslChangeShiftRequests,
      status: workStatus,
    };

    return mappedTimesheet;
  }

  async getUserById(id: number): Promise<UserDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        role: true,
        position: true,
        timeEntries: true,
        employeeSchedule: true,
      },
    });

    return this.mapUser(user as User);
  }

  /**
   * Maps a single user object from the database model to the DTO.
   *
   * @param {User} user - The user object from the database.
   * @returns {UserDTO} The mapped User DTO.
   */
  private mapUser(user: User): UserDTO {
    const mappedUser: UserDTO = {
      ...user,
      overtimes: user.overtimes || [],
    };

    return mappedUser;
  }
}
