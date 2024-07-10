import { NotificationTypeEnum } from '@/enums/notification-type.enum';
import { PositionEnum, PositionHelper } from '@/enums/position.enum';
import { RoleEnum } from '@/enums/role.enum';
import {
  AddMemberToScheduleRequestInput,
  ApproveOvertimeRequestInput,
  CreateChangeShiftRequestInput,
  CreateEmployeeScheduleRequestInput,
  CreateESLChangeShiftRequestInput,
  CreateESLOffsetRequestInput,
  CreateLeaveRequestInput,
  CreateOvertimeRequestInput,
  CreateSummaryRequestInput,
  DeleteEmployeeScheduleRequestInput,
  LeaveDateRequestInput,
  MultiProjectRequestInput,
  UpdateEmployeeScheduleRequestInput,
  WorkingDayTimesRequestInput,
} from '@/graphql/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { InputValidationMessageEnum } from '@/enums/input-validation-message.enum';
import { ErrorMessageEnum } from '@/enums/error-messages.enum';

export interface ICustomValidationException {
  errors: { [key: string]: ICustomValidationException[] };
  message: string;
  extension: {
    VARIABLE_STRING: string;
    index?: number;
  };
}

@Injectable()
export class CustomInputValidation implements ICustomValidationException {
  public errors: { [key: string]: ICustomValidationException[] } = {};
  public message: string = '';
  public extension: { VARIABLE_STRING: string; index?: number } = {
    VARIABLE_STRING: '',
  };
  constructor(protected prisma: PrismaService) {}

  addError(propertyName: string, message: string, index?: number) {
    const key = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);

    if (!this.errors[key]) {
      this.errors[key] = [];
    }

    const error: ICustomValidationException = {
      errors: {},
      message,
      extension: {
        VARIABLE_STRING: key,
        ...(index !== undefined && { index }),
      },
    };

    this.errors[key].push(error);
  }

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  getErrors(): ICustomValidationException | null {
    return this.hasErrors()
      ? {
          errors: this.errors,
          message: this.message,
          extension: this.extension,
        }
      : null;
  }

  clearErrors() {
    this.errors = {};
    this.message = '';
    this.extension = { VARIABLE_STRING: '' };
  }

  /**
   * function that check if user exist
   * @param id
   * @returns boolean true or false
   */
  public async checkUserExist(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user !== null;
  }

  /**
   * function that check if user is a manager role
   * @param id
   * @returns boolean true or false
   */
  public async CheckManagerUser(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    const role = await this.prisma.role.findFirst({
      where: {
        name: RoleEnum.MANAGER,
      },
    });

    return user?.roleId == role?.id;
  }

  /**
   * Funciotn that check is user has a manager position
   * @param id
   * @returns boolean true or false
   */
  public async CheckManagerPosition(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    const role = await this.prisma.role.findFirst({
      where: {
        name: RoleEnum.MANAGER,
      },
    });
    if (user == null) {
      return false;
    }

    return user?.roleId == role?.id && user?.positionId == PositionEnum.MANAGER;
  }

  /**
   * Function that check if user is a projectLeader
   * @param id
   * @returns boolean true or false
   */
  public async checkProjectLeaderUser(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user != null && PositionHelper.isLeader(user.positionId);
  }

  /**
   * Function that check if user is not a ESL User
   * @param id
   * @returns boolean true or false
   */
  public async checkNonESLUser(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user != null && user.positionId != PositionEnum.ESL_TEACHER;
  }

  /**
   * Function that check if a project exist
   * @param id
   * @returns boolean true or false
   */
  public async checkProjectExist(id: number): Promise<boolean> {
    return (await this.prisma.project.findFirst({ where: { id: id } })) != null;
  }

  /**
   * Function that check if overtime exist
   * @param id
   * @returns boolean true or false
   */
  public async checkOvertimeExist(id: number): Promise<boolean> {
    return (
      (await this.prisma.overtime.findFirst({ where: { id: id } })) != null
    );
  }

  /**
   * Function that check if Time Entry is valid
   * @param id
   * @returns boolean true or false
   */
  public async checkTimeEntryExist(id: number): Promise<boolean> {
    return (
      (await this.prisma.timeEntry.findFirst({ where: { id: id } })) != null
    );
  }

  /**
   * Functiion that checkif change shift request Exist
   * @param timeEntryId
   * @returns boolean true or false
   */
  public async checkChangeShiftRequestExist(
    timeEntryId: number,
  ): Promise<boolean> {
    return (
      (await this.prisma.changeShiftRequest.findFirst({
        where: { timeEntryId: timeEntryId },
      })) != null
    );
  }

  /**
   * Function that Check if ESL Change shift exist
   * @param timeEntryId
   * @returns boolean true or false
   */
  public async checkESLChangeShiftRequestExist(
    timeEntryId: number,
  ): Promise<boolean> {
    return (
      (await this.prisma.eslChangeShiftRequest.findFirst({
        where: {
          timeEntryId: timeEntryId,
          isLeaderApproved: true,
        },
      })) != null
    );
  }

  /**
   * Function that check if a position exist
   * @param id
   * @returns boolean true or false
   */
  public async checkPositionExist(id: number): Promise<boolean> {
    return (
      (await this.prisma.position.findFirst({
        where: {
          id: id,
        },
      })) != null
    );
  }

  /**
   * Function that check if a role exist
   * @param id
   * @returns boolean true or false
   */
  public async checkRoleExist(id: number): Promise<boolean> {
    return (
      (await this.prisma.role.findFirst({
        where: {
          id: id,
        },
      })) != null
    );
  }

  /**
   * Function that check if schedule exist
   * @param id
   * @returns boolean true or false
   */
  public async checkScheduleExist(id: number): Promise<boolean> {
    return (
      (await this.prisma.employeeSchedule.findFirst({
        where: {
          id: id,
        },
      })) != null
    );
  }

  /**
   * Function that check the type of a leave exist
   * @param id
   * @returns boolean true or false
   */
  public async checkLeaveType(id: number): Promise<boolean> {
    return (
      (await this.prisma.leaveType.findFirst({
        where: {
          id: id,
        },
      })) != null
    );
  }

  /**
   * Function that check if date is a ISO Format
   * @param date
   * @returns boolean true or false
   */
  public checkDateFormat(date: string): boolean {
    const format = 'yyyy-MM-dd';

    const parsed = DateTime.fromFormat(date, format, { zone: 'utc' });

    return parsed.isValid;
  }

  /**
   * Function That check if the email is a valid email
   * @param email
   * @returns boolean true or false
   */
  public checkEmailFormat(email: string): boolean {
    // Matches a valid email address format
    const regexPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    return regexPattern.test(email);
  }

  /**
   * Function that check if leavedate input at not empty or null
   * @param leaveDates
   * @returns boolean true or false
   */
  public checkLeaveDates(leaveDates: LeaveDateRequestInput[]): boolean {
    return !(leaveDates == null || leaveDates.length === 0);
  }

  /**
   * Function that check if a multiproject is not empty or null
   * @param multiProjects
   * @returns boolean true or false
   */
  public checkMultiProjects(
    multiProjects: MultiProjectRequestInput[],
  ): boolean {
    return !(multiProjects == null || multiProjects.length === 0);
  }

  /**
   * Function that check if a notification exist and have the same type
   * @param id
   * @param type
   * @returns boolean true or false
   */
  public async checkNotificationExist(
    id: number,
    type: string,
  ): Promise<boolean> {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: id,
      },
    });
    return notification?.type === type;
  }

  /**
   * Function that check overtime notification
   * @param id
   * @returns boolean true or false
   */
  public async checkOvertimeNotificationExist(id: number): Promise<boolean> {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: id,
      },
    });

    return notification?.type == NotificationTypeEnum.OVERTIME;
  }

  /**
   * Function that check all ESLOffset if it exist
   * @param ids
   * @returns boolean true or false
   */
  public async checkAllESLOffsetsExist(ids: number[]): Promise<boolean> {
    const offsets = await this.prisma.eslOffset.findMany({
      where: {
        id: { in: ids },
      },
    });

    return offsets.length === ids.length;
  }
  /**
   * Function that check if ESL Offset is not used
   * @param ids
   * @param propertyName
   * @returns Error message or null
   */
  public async checkESLOffsetNotUsed(
    ids: number[],
    propertyName: string,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!(await this.checkAllESLOffsetsExist(ids))) {
      this.addError(
        propertyName,
        InputValidationMessageEnum.INVALID_ESL_OFFSET_IDS,
      );
    }

    const offsets = await this.prisma.eslOffset.findMany({
      where: { id: { in: ids } },
    });

    offsets.forEach((offset) => {
      if (offset.isUsed) {
        this.addError(
          propertyName,
          `${InputValidationMessageEnum.ALREADY_USED_ESL_OFFSET} ${offset.id}`,
        );
      }
    });

    return this.getErrors();
  }

  /**
   * Function that validate user leave request
   * @param leave
   * @returns Error message or null
   */
  public async checkLeaveRequestInput(
    leave: CreateLeaveRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();
    let index = 0;

    if (!this.CheckManagerUser(leave.userId)) {
      this.addError(
        leave.userId.toString(),
        InputValidationMessageEnum.INVALID_USER,
      );
    }

    if (!this.CheckManagerUser(leave.managerId)) {
      this.addError(
        leave.managerId.toString(),
        InputValidationMessageEnum.INVALID_MANAGER,
      );
    }

    if (!this.checkLeaveType(leave.leaveTypeId)) {
      this.addError(
        leave.leaveTypeId.toString(),
        InputValidationMessageEnum.INVALID_LEAVE_TYPE,
      );
    }

    if (!this.checkLeaveDates(leave.leaveDates)) {
      this.addError(
        leave.leaveDates.toString(),
        InputValidationMessageEnum.MISSING_LEAVE_DATES,
      );
    }

    if (!this.checkMultiProjects(leave.leaveProjects)) {
      this.addError(
        leave.leaveProjects.toString(),
        InputValidationMessageEnum.MISSING_PROJECTS,
      );
    }

    index = 0;
    leave.leaveProjects?.forEach((project) => {
      if (!this.checkProjectExist(project.projectId)) {
        this.addError(
          project.projectId.toString(),
          InputValidationMessageEnum.INVALID_PROJECT,
          index,
        );
      }

      if (!this.checkUserExist(project.projectLeaderId)) {
        this.addError(
          project.projectLeaderId.toString(),
          InputValidationMessageEnum.INVALID_PROJECT_LEADER,
          index,
        );
      }

      index++;
    });

    index = 0;
    leave.leaveDates?.forEach((date) => {
      if (!this.checkDateFormat(date.leaveDate)) {
        this.addError(
          date.leaveDate.toString(),
          InputValidationMessageEnum.INVALID_DATE,
          index,
        );
      }
      index++;
    });

    return this.getErrors();
  }

  /**
   * Function that validate user overtime request
   * @param overtime
   * @returns Error message or null
   */
  public async checkOvertimeRequestInput(
    overtime: CreateOvertimeRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();
    let index = 0;

    if (!this.checkUserExist(overtime.userId)) {
      this.addError(
        overtime.userId.toString(),
        InputValidationMessageEnum.INVALID_USER,
        index,
      );
    }

    if (!this.CheckManagerUser(overtime.managerId)) {
      this.addError(
        overtime.managerId.toString(),
        InputValidationMessageEnum.INVALID_MANAGER,
      );
    }

    if (!this.checkDateFormat(overtime.date)) {
      this.addError(
        overtime.date.toString(),
        InputValidationMessageEnum.INVALID_DATE,
      );
    }

    index = 0;
    overtime.overtimeProjects?.forEach((project) => {
      if (!this.checkProjectExist(project.projectId)) {
        this.addError(
          project.projectId.toString(),
          InputValidationMessageEnum.INVALID_PROJECT,
          index,
        );
      }

      if (!this.checkUserExist(project.projectLeaderId)) {
        this.addError(
          project.projectLeaderId.toString(),
          InputValidationMessageEnum.INVALID_PROJECT_LEADER,
          index,
        );
      }
      index++;
    });

    return this.getErrors();
  }

  /**
   * Function that Check overtime summary request from the user
   * @param overtime
   * @returns Error message or null
   */
  public async CheckSummaryOvertimeRequestInput(
    overtime: CreateSummaryRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.checkDateFormat(overtime.startDate)) {
      this.addError(
        overtime.startDate.toString(),
        InputValidationMessageEnum.INVALID_DATE,
      );
    }

    if (!this.checkDateFormat(overtime.endDate)) {
      this.addError(
        overtime.endDate.toString(),
        InputValidationMessageEnum.INVALID_DATE,
      );
    }

    if (!this.CheckEmptyOvertimeRange(overtime.startDate, overtime.endDate)) {
      this.addError(overtime.startDate, ErrorMessageEnum.EMPTY_OVERTIME);
    }

    return this.getErrors();
  }

  /**
   * Function that check overtime is in range
   * @param startDate
   * @param endDate
   * @returns  boolean true or false
   */
  public async CheckEmptyOvertimeRange(
    startDate: string,
    endDate: string,
  ): Promise<boolean> {
    const start: Date = new Date(startDate);
    const end: Date = new Date(endDate);

    const overtimeSummary = await this.prisma.overtime.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });
    return overtimeSummary.length > 0;
  }

  /**
   * Function that check the overtime request input of the user are valid
   * @param request
   * @returns Error message or null
   */
  public async checkApproveOvertimeRequestInput(
    request: ApproveOvertimeRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.checkUserExist(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.INVALID_USER,
      );
    }

    if (
      !this.CheckManagerUser(request.userId) ||
      (await this.checkProjectLeaderUser(request.userId))
    ) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.NOT_MANAGER_PROJECT_LEADER,
      );
    }

    return this.getErrors();
  }

  /**
   * Function that check the Changeshift request input of the user are valid
   * @param request
   * @returns Error message or null
   */
  public async checkChangeShiftRequestInput(
    request: CreateChangeShiftRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();
    let index = 0;

    if (await this.checkChangeShiftRequestExist(request.timeEntryId)) {
      this.addError(
        request.timeEntryId.toString(),
        InputValidationMessageEnum.DUPLICATE_REQUEST,
      );
    }

    if (!this.checkUserExist(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.INVALID_USER,
      );
    }

    if (!this.checkNonESLUser(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.INVALID_NON_ESL_USER,
      );
    }

    if (!this.checkTimeEntryExist(request.timeEntryId)) {
      this.addError(
        request.timeEntryId.toString(),
        InputValidationMessageEnum.INVALID_TIME_ENTRY,
      );
    }

    if (!this.CheckManagerUser(request.managerId)) {
      this.addError(
        request.managerId.toString(),
        InputValidationMessageEnum.INVALID_MANAGER,
      );
    }

    if (!this.checkMultiProjects(request.projects)) {
      this.addError(
        request.projects.toString(),
        InputValidationMessageEnum.MISSING_PROJECTS,
      );
    }

    index = 0;
    request.projects?.forEach((project) => {
      if (!this.checkProjectExist(project.projectId)) {
        this.addError(
          project.projectId.toString(),
          InputValidationMessageEnum.INVALID_PROJECT,
          index,
        );
      }

      if (!this.checkUserExist(project.projectLeaderId)) {
        this.addError(
          project.projectLeaderId.toString(),
          InputValidationMessageEnum.INVALID_PROJECT_LEADER,
          index,
        );
      }

      index++;
    });

    return this.getErrors();
  }

  /**
   * Function that check the ESL Changeshift request of the user are valid
   * @param request
   * @returns Error message or null
   */
  public async checkESLChangeShiftRequestInput(
    request: CreateESLChangeShiftRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    this.checkESLOffsetNotUsed(
      request.eslOffsetIDs,
      request.eslOffsetIDs.toString(),
    );

    if (await this.checkESLChangeShiftRequestExist(request.timeEntryId)) {
      this.addError(
        request.timeEntryId.toString(),
        InputValidationMessageEnum.DUPLICATE_REQUEST,
      );
    }

    if (!this.checkUserExist(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.INVALID_USER,
      );
    }

    if (await this.checkNonESLUser(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.INVALID_ESL_USER,
      );
    }

    if (!this.checkTimeEntryExist(request.timeEntryId)) {
      this.addError(
        request.timeEntryId.toString(),
        InputValidationMessageEnum.INVALID_TIME_ENTRY,
      );
    }

    if (await this.checkNonESLUser(request.teamLeaderId)) {
      this.addError(
        request.teamLeaderId.toString(),
        InputValidationMessageEnum.INVALID_TEAM_LEADER,
      );
    }

    return this.getErrors();
  }

  /**
   * Check the ESLOffsetRequest of the user are valid
   * @param request
   * @returns Error message or null
   */
  public async checkESLOffsetRequestInput(
    request: CreateESLOffsetRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.checkUserExist(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.INVALID_USER,
      );
    }

    if (await this.checkNonESLUser(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.INVALID_ESL_USER,
      );
    }

    if (!this.checkTimeEntryExist(request.timeEntryId)) {
      this.addError(
        request.timeEntryId.toString(),
        InputValidationMessageEnum.INVALID_TIME_ENTRY,
      );
    }

    if (await this.checkNonESLUser(request.teamLeaderId)) {
      this.addError(
        request.teamLeaderId.toString(),
        InputValidationMessageEnum.INVALID_TEAM_LEADER,
      );
    }

    return this.getErrors();
  }

  /**
   * Function that check EmployeeSchedule request by user are valid
   * @param request
   * @returns Error message or null
   */
  public async CheckEmployeeScheduleRequestInput(
    request: CreateEmployeeScheduleRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.CheckHrRole(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.NOT_HR_ADMIN,
      );
    }

    if (!request.scheduleName) {
      this.addError(
        request.scheduleName!,
        InputValidationMessageEnum.INVALID_SCHEDULE_NAME.toString(),
      );
    }

    if (!this.CheckScheduleNameAlreadyExist(request.scheduleName!.toString())) {
      this.addError(
        request.scheduleName!,
        InputValidationMessageEnum.DUPLICATE_SCHEDULE_NAME,
      );
    }

    request.workingDays.forEach((workingday) => {
      if (!workingday.day) {
        this.addError(workingday.day!, InputValidationMessageEnum.INVALID_DAY);
      }

      if (!workingday.from) {
        this.addError(
          workingday.from!,
          InputValidationMessageEnum.INVALID_START_TIME,
        );
      }

      if (!workingday.to) {
        this.addError(
          workingday.to!,
          InputValidationMessageEnum.INVALID_END_TIME,
        );
      }

      if (!workingday.breakFrom) {
        this.addError(
          workingday.breakFrom!,
          InputValidationMessageEnum.INVALID_END_TIME,
        );
      }

      if (!workingday.breakTo) {
        this.addError(
          workingday.breakTo!,
          InputValidationMessageEnum.INVALID_END_TIME,
        );
      }
    });

    return this.getErrors();
  }

  /**
   * Function that check if the schedule name has already been added
   * @param scheduleName
   * @returns Boolean true or false
   */
  public async CheckScheduleNameAlreadyExist(
    scheduleName: string,
  ): Promise<boolean> {
    const workingDay = await this.prisma.employeeSchedule.findFirst({
      where: {
        name: scheduleName,
      },
    });

    return workingDay == null;
  }

  /**
   * Function that check if user is a HR Role
   * @param userId
   * @returns Boolean true or false
   */
  private async CheckHrRole(userId: number): Promise<boolean> {
    const user = this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    return user.role.name.toLowerCase() == RoleEnum.HR_ADMIN.toLowerCase();
  }

  /**
   * Function that check if Schedule name exist in the DB
   * @param scheduleName
   * @param employeeScheduleId
   * @returns Boolean true or false
   */
  private async CheckScheduleNameExist(
    scheduleName: string,
    employeeScheduleId: number,
  ): Promise<boolean> {
    const user = await this.prisma.employeeSchedule.findFirst({
      where: {
        name: scheduleName,
      },
    });

    if (user?.id == employeeScheduleId) {
      return false;
    }

    return user != null;
  }

  /**
   * Function that check if the Schedule of an employee exist
   * @param employeeScheduleId
   * @returns Boolean true or false
   */
  private async CheckScheduleExist(
    employeeScheduleId: number,
  ): Promise<boolean> {
    const user = await this.prisma.employeeSchedule.findFirst({
      where: {
        id: employeeScheduleId,
      },
    });

    return user == null;
  }

  /**
   * Function that check on the request update Employee schedule from a user are valid
   * @param request
   * @returns Error message or null
   */
  public async CheckUpdateEmployeeScheduleRequestInput(
    request: UpdateEmployeeScheduleRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.CheckHrRole(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.NOT_HR_ADMIN,
      );
    }

    if (!request.scheduleName) {
      this.addError(
        request.scheduleName!,
        InputValidationMessageEnum.INVALID_SCHEDULE_NAME,
      );
    }

    if (await this.CheckScheduleExist(request.employeeScheduleId)) {
      this.addError(
        request.employeeScheduleId.toString(),
        InputValidationMessageEnum.INVALID_SCHEDULE_ID,
      );
    }

    if (
      await this.CheckScheduleNameExist(
        request.scheduleName!,
        request.employeeScheduleId,
      )
    ) {
      this.addError(
        request.employeeScheduleId.toString(),
        InputValidationMessageEnum.DUPLICATE_SCHEDULE_NAME,
      );
    }

    request.workingDays.forEach((workingDay) => {
      if (!workingDay.day) {
        this.addError(workingDay.day!, InputValidationMessageEnum.INVALID_DAY);
      }

      if (!workingDay.from) {
        this.addError(
          workingDay.from!,
          InputValidationMessageEnum.INVALID_START_TIME,
        );
      }

      if (!workingDay.to) {
        this.addError(
          workingDay.to!,
          InputValidationMessageEnum.INVALID_END_TIME,
        );
      }
    });

    return this.getErrors();
  }

  /**
   * Function that check a employee is within its schedule
   * @param employeeId
   * @param scheduleId
   * @param prisma
   * @returns Boolean true or false
   */
  private static async CheckEmployeeWithinSchedule(
    employeeId: number,
    scheduleId: number,
    prisma: PrismaService,
  ): Promise<boolean> {
    const employee = await prisma.user.findFirst({
      where: {
        id: employeeId,
      },
      include: {
        employeeSchedule: true,
      },
    });

    if (!employee) {
      return false;
    }

    return employee.employeeScheduleId === scheduleId;
  }

  /**
   * Function that check user exist Static private
   * @param id
   * @param prisma
   * @returns Boolean true or false
   */
  private static CheckUserExist(id: number, prisma: PrismaService) {
    const user = prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    return user != null;
  }
  /**
   * Function that Check user input for a new member
   * @param request
   * @param prisma
   * @returns Error message or null
   */
  //@ts-expect-error followed the ASP Validation, place this function just incase there will be usage
  private async CheckAddMemberRequestInput(
    request: AddMemberToScheduleRequestInput,
    prisma: PrismaService,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.CheckHrRole(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.NOT_HR_ADMIN,
      );
    }

    if (await this.checkScheduleExist(request.scheduleId)) {
      this.addError(
        request.scheduleId.toString(),
        InputValidationMessageEnum.INVALID_SCHEDULE_ID,
      );
    }

    for (const employeeId of request.employeeIds) {
      if (!(await CustomInputValidation.CheckUserExist(employeeId, prisma))) {
        this.addError(
          employeeId.toString(),
          InputValidationMessageEnum.INVALID_EMPLOYEE,
        );
      } else {
        if (
          await CustomInputValidation.CheckEmployeeWithinSchedule(
            employeeId,
            request.scheduleId,
            prisma,
          )
        ) {
          const user = await prisma.user.findUnique({
            where: { id: employeeId },
          });
          this.addError(
            request.scheduleId.toString(),
            `${user?.name} ${InputValidationMessageEnum.DUPLICATE_EMPLOYEE}`,
          );
        }
      }
    }
    return this.getErrors();
  }

  /**
   * Function that check request before deleting employee schedule
   * @param request
   * @returns Error message or null
   */
  //@ts-expect-error followed the ASP Validation, place this function just incase there will be usage
  private async CheckDeleteEmployeeScheduleRequestInput(
    request: DeleteEmployeeScheduleRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.CheckHrRole(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.NOT_HR_ADMIN,
      );
    }

    if (await this.CheckScheduleExist(request.employeeScheduleId)) {
      this.addError(
        request.employeeScheduleId.toString(),
        InputValidationMessageEnum.INVALID_SCHEDULE_ID,
      );
    }

    return this.getErrors();
  }

  /**
   * Function that check if working days and startTime are valid
   * @param workingDays
   * @returns Error message or null
   */
  public async checkListOfWorkingDays(
    workingDays: WorkingDayTimesRequestInput[],
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    workingDays.forEach((workingDay) => {
      if (!workingDay.day) {
        this.addError(workingDay.day!, InputValidationMessageEnum.INVALID_DAY);
      }

      if (!workingDay.from) {
        this.addError(
          workingDay.from!,
          InputValidationMessageEnum.INVALID_START_TIME,
        );
      }

      if (!workingDay.to) {
        this.addError(
          workingDay.to!,
          InputValidationMessageEnum.INVALID_END_TIME,
        );
      }

      if (!workingDay.breakFrom) {
        this.addError(
          workingDay.breakFrom!,
          InputValidationMessageEnum.INVALID_END_TIME,
        );
      }

      if (!workingDay.breakTo) {
        this.addError(
          workingDay.breakTo!,
          InputValidationMessageEnum.INVALID_END_TIME,
        );
      }
    });

    return this.getErrors();
  }
}
