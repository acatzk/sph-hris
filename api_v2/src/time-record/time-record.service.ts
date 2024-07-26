import { WorkStatusEnum } from '@/enums/work-status.enum';
import { TimeEntryDTO, User, UserDTO } from '@/graphql/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { TimeEntriesWithRelations } from '@/types/time-record.types';

@Injectable()
export class TimeRecordService {
    constructor(private prisma: PrismaService){}

    async getTimeEntriesById(id: number): Promise<TimeEntryDTO[]> {
        const timeEntries: TimeEntriesWithRelations[] = await this.prisma.timeEntry.findMany({
            where: {
                userId: id
            },
            include: {
                user: true,
                workInterruptions: true,
                eslChangeShiftRequests: true,
                eslOffsets: true,
                timeIn: true,
                timeOut: true,
            }
        });

        return timeEntries.map(timeEntry => this.mapTimesheet(timeEntry));
    }

    /**
   * Maps a single employee timesheet from the database model to the DTO.
   *
   * @param {WorkInterruption} interruption - The work interruption object from the database.
   * @returns {WorkInterruptionDTO} The mapped work interruption DTO.
   */
    private mapTimesheet(timeEntry: any): TimeEntryDTO{

        let workStatus, late = 0;
        //let undertime = 0;
        if(timeEntry.timeIn){
            workStatus = WorkStatusEnum.ONDUTY;
            late = timeEntry.timeIn.timeHour - timeEntry.startTime;
            //undertime = timeEntry.timeOut.timeHour - timeEntry.endTime;
        }
        else{
            workStatus = WorkStatusEnum.ABSENT
        }

        const mappedTimesheet: TimeEntryDTO = {
            user: timeEntry.user,
            startTime: timeEntry.startTime ? 
            timeEntry.startTime.toISOString().slice(11, 19)
            : null,
            endTime: timeEntry.endTime ? 
            timeEntry.endTime.toISOString().slice(11, 19)
            : null,
            workedHours: timeEntry.workedHours || null,
            trackedHours: timeEntry.trackedHours || null,
            timeIn: timeEntry.timeIn || null,
            timeOut: timeEntry.timeOut || null,
            date: timeEntry.date,
            late: late,
            undertime: 0, //TODO add logic here maybe  time out - endtime (something like that)
            eslChangeShift: timeEntry.eslChangeShiftRequests.length === 0 ? 
            null
            : timeEntry.eslChangeShiftRequests,
            status: workStatus,
            isLeaderApproved: timeEntry.overtime?.isLeaderApproved || null,
            changeShift: timeEntry.changeShiftRequest || null,
            id: timeEntry.id,
            userId: timeEntry.userId,
            timeInId: timeEntry.timeInId || null,
            timeOutId: timeEntry.timeOutId || null,
            breakStartTime: timeEntry.breakStartTime,
            breakEndTime: timeEntry.breakEndTime,
            overtime: timeEntry.overtime || null,
            changeShiftRequest: timeEntry.changeShiftRequest || null,
            workInterruptions: timeEntry.workInterruptions,
            eslOffsets: timeEntry.eslOffsets || null,
            createdAt: timeEntry.createdAt || null,
            updatedAt: timeEntry.updatedAt || null
        };

        return mappedTimesheet;
    }

    async getUserById(id: number): Promise<UserDTO>{
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                role: true,
                position: true,
                timeEntries: true,
                employeeSchedule: true,
            }
        });

        return this.mapUser(user as User);
    }

    private mapUser(user: User): UserDTO{
        const mappedUser: UserDTO = {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImageId: user.profileImageId,
            profileImage: user.profileImage,
            roleId: user.roleId,
            positionId: user.positionId,
            employeeScheduleId: user.employeeScheduleId,
            paidLeaves: user.paidLeaves,
            isOnline: user.isOnline,
            role: user.role,
            position: user.position,
            employeeSchedule: user.employeeSchedule,
            timeEntries: user.timeEntries,
            overtimes: user.overtimes,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }

        return mappedUser;
    }
}
