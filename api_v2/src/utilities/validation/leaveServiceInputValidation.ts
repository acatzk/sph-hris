import { Injectable } from '@nestjs/common';
import {
  CustomInputValidation,
  ICustomValidationException,
} from '../validation.util';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CancelLeaveRequestInput,
  CreateLeaveRequestInput,
} from '@/graphql/graphql';
import { InputValidationMessageEnum } from '@/enums/input-validation-message.enum';

@Injectable()
export class LeaveServiceInputValidation extends CustomInputValidation {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  /**
   * Function that validates the user input for creating a leave request
   * @param leave
   * @returns Error message or null
   */
  public async CheckLeaveRequestInput(
    leave: CreateLeaveRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();
    let index = 0;

    if (!this.checkUserExist(leave.userId)) {
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
    leave.leaveProjects.forEach((project) => {
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
    leave.leaveDates.forEach((date) => {
      if (!this.checkDateFormat(date.leaveDate)) {
        this.addError(
          date.leaveDate,
          InputValidationMessageEnum.INVALID_DATE,
          index,
        );
      }
      index++;
    });

    return this.getErrors();
  }

  /**
   * Function that validate a user request to cancel there leave
   * @param request
   * @returns Error message or null
   */
  public async CheckCancelLeaveRequestInput(
    request: CancelLeaveRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.checkUserExist(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.INVALID_USER,
      );
    }

    if (!this.CheckUserOwnsLeave(request.userId, request.leaveId)) {
      this.addError(
        request.leaveId.toString(),
        InputValidationMessageEnum.INVALID_LEAVE_ID,
      );
    }

    if (!this.CheckPendingStatus(request.leaveId)) {
      this.addError(
        request.leaveId.toString(),
        InputValidationMessageEnum.LEAVE_NOT_PENDING,
      );
    }

    return this.getErrors();
  }

  //private methods
  /**
   * Function that check if the leave belongs to the user
   * @param userId
   * @param leaveId
   * @returns Boolean True or False
   */
  private async CheckUserOwnsLeave(
    userId: number,
    leaveId: number,
  ): Promise<boolean> {
    try {
      const leave = await this.prisma.leave.findFirst({
        where: {
          id: leaveId,
        },
      });

      return leave != null && leave.userId == userId;
    } catch {
      return false;
    }
  }

  /**
   * Function that check if the leave is approve or pending
   * @param leaveId
   * @returns Boolean True or False
   */
  private async CheckPendingStatus(leaveId: number): Promise<boolean> {
    try {
      const leave = await this.prisma.leave.findFirst({
        where: {
          id: leaveId,
        },
      });

      const isDisapproved =
        leave?.isLeaderApproved == false && leave.isManagerApproved == false;
      const isApproved =
        leave?.isLeaderApproved == true && leave.isManagerApproved == true;

      return leave != null && !(isDisapproved || isApproved);
    } catch {
      return false;
    }
  }
}
