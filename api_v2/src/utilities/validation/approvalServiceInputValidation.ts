import { PrismaService } from '@/prisma/prisma.service';
import {
  CustomInputValidation,
  ICustomValidationException,
} from '../validation.util';
import { Injectable } from '@nestjs/common';
import { MultiProjectTypeEnum } from '@/enums/multi-project-type.enum';
import {
  ApproveChangeShiftRequestInput,
  ApproveESLChangeShiftRequestInput,
  ApproveLeaveUndertimeRequestInput,
  ApproveOvertimeRequestInput,
  MultiProject,
} from '@/graphql/graphql';
import { InputValidationMessageEnum } from '@/enums/input-validation-message.enum';
import { NotificationTypeEnum } from '@/enums/notification-type.enum';

@Injectable()
export class ApprovalServiceInputValidation extends CustomInputValidation {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
  /**
   * Function that check if projectleader has a project base on the type of multiproject
   * @param projectLeaderId
   * @param id
   * @param type
   * @returns Boolean true or false
   */
  public async checkApprovingProjectLeader(
    projectLeaderId: number,
    id: number,
    type: string,
  ): Promise<boolean> {
    let multiProject: MultiProject | null = null;

    if (type === MultiProjectTypeEnum.LEAVE) {
      multiProject = (await this.prisma.multiProject.findFirst({
        where: {
          type: type,
          leaveId: id,
          projectLeaderId: projectLeaderId,
        },
      })) as MultiProject | null;
    }

    if (type === MultiProjectTypeEnum.OVERTIME) {
      multiProject = (await this.prisma.multiProject.findFirst({
        where: {
          type: type,
          overtimeId: id,
          projectLeaderId: projectLeaderId,
        },
      })) as MultiProject | null;
    }

    if (type === MultiProjectTypeEnum.CHANGE_SHIFT) {
      multiProject = (await this.prisma.multiProject.findFirst({
        where: {
          type: type,
          changeShiftRequestId: id,
          projectLeaderId: projectLeaderId,
        },
      })) as MultiProject | null;
    }

    return multiProject != null;
  }

  /**
   * Function that validate user Leave request
   * @param request
   * @returns Error message or null
   */
  public async checkApproveLeaveRequestInput(
    request: ApproveLeaveUndertimeRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.checkUserExist(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.INVALID_USER,
      );
    }

    if (
      !(
        this.CheckManagerUser(request.userId) ||
        this.checkProjectLeaderUser(request.userId)
      )
    ) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.NOT_MANAGER_PROJECT_LEADER,
      );
    }

    if (
      !this.checkNotificationExist(
        request.notificationId,
        NotificationTypeEnum.LEAVE,
      )
    ) {
      this.addError(
        request.notificationId.toString(),
        InputValidationMessageEnum.INVALID_NOTIFICATION,
      );
    }

    return this.getErrors();
  }

  /**
   * Function that validate user Undertime request
   * @param request
   * @returns Error message or null
   */
  public async checkApproveUndertimeRequestInput(
    request: ApproveLeaveUndertimeRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.checkUserExist(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.INVALID_USER,
      );
    }

    if (
      !(
        this.CheckManagerUser(request.userId) ||
        this.checkProjectLeaderUser(request.userId)
      )
    ) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.NOT_MANAGER_PROJECT_LEADER,
      );
    }

    if (
      !this.checkNotificationExist(
        request.notificationId,
        NotificationTypeEnum.UNDERTIME,
      )
    ) {
      this.addError(
        request.notificationId.toString(),
        InputValidationMessageEnum.INVALID_NOTIFICATION,
      );
    }

    return this.getErrors();
  }

  /**
   * Function that check if leader approval of overtime request is valid
   * @param request
   * @returns Error message or null
   */
  public async checkLeaderApproveOvertimeRequestInput(
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
      !(
        this.CheckManagerUser(request.userId) ||
        this.checkProjectLeaderUser(request.userId)
      )
    ) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.NOT_MANAGER_PROJECT_LEADER,
      );
    }

    if (
      request.notificationId == null ||
      !this.checkNotificationExist(
        request.notificationId,
        NotificationTypeEnum.OVERTIME,
      )
    ) {
      this.addError(
        request.notificationId!.toString(),
        InputValidationMessageEnum.INVALID_NOTIFICATION,
      );
    }

    return this.getErrors();
  }

  /**
   * Function that check if manager approval of overtime request is valid
   * @param request
   * @returns Error message or null
   */
  public async checkManagerApproveOvertimeRequestInput(
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
      !(
        this.CheckManagerUser(request.userId) ||
        this.checkProjectLeaderUser(request.userId)
      )
    ) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.NOT_MANAGER_PROJECT_LEADER,
      );
    }

    if (
      request.overtimeId == null ||
      !this.checkOvertimeExist(request.overtimeId!)
    ) {
      this.addError(
        request.notificationId!.toString(),
        InputValidationMessageEnum.INVALID_OVERTIME,
      );
    }

    if (request.isApproved && request.approvedMinutes == null) {
      this.addError(
        request.approvedMinutes!.toString(),
        InputValidationMessageEnum.MISSING_APPROVED_MINUTES,
      );
    }

    return this.getErrors();
  }

  /**
   * Function that check if leader or manager approval of Changeshift request is valid
   * @param request
   * @returns Error message or null
   */
  public async checkApproveChangeShiftRequestInput(
    request: ApproveChangeShiftRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.checkUserExist(request.userId)) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.INVALID_USER,
      );
    }

    if (
      !(
        this.CheckManagerUser(request.userId) ||
        this.checkProjectLeaderUser(request.userId)
      )
    ) {
      this.addError(
        request.userId.toString(),
        InputValidationMessageEnum.NOT_MANAGER_PROJECT_LEADER,
      );
    }

    if (
      !this.checkNotificationExist(
        request.notificationId,
        NotificationTypeEnum.CHANGE_SHIFT,
      )
    ) {
      this.addError(
        request.notificationId!.toString(),
        InputValidationMessageEnum.INVALID_NOTIFICATION,
      );
    }

    return this.getErrors();
  }

  /**
   * Function that check user is a valid teamLeader and approve ESL Change Shift is valid
   * @param request
   * @returns Error message or null
   */
  public async ESLChangeShiftStatusRequestInput(
    request: ApproveESLChangeShiftRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.checkUserExist(request.teamLeaderId)) {
      this.addError(
        request.teamLeaderId.toString(),
        InputValidationMessageEnum.INVALID_USER,
      );
    }

    if (await this.checkNonESLUser(request.teamLeaderId)) {
      this.addError(
        request.teamLeaderId.toString(),
        InputValidationMessageEnum.INVALID_TEAM_LEADER,
      );
    }

    if (
      !this.checkNotificationExist(
        request.notificationId,
        NotificationTypeEnum.ESL_OFFSET_SCHEDULE,
      )
    ) {
      this.addError(
        request.notificationId!.toString(),
        InputValidationMessageEnum.INVALID_NOTIFICATION,
      );
    }

    return this.getErrors();
  }
  /**
   * Function that check on the status of ESLoffset request
   * @param request
   * @returns Error message or null
   */
  public async ChangeESLOffsetStatusRequestInput(
    request: ApproveESLChangeShiftRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.checkUserExist(request.teamLeaderId)) {
      this.addError(
        request.teamLeaderId.toString(),
        InputValidationMessageEnum.INVALID_USER,
      );
    }

    if (await this.checkNonESLUser(request.teamLeaderId)) {
      this.addError(
        request.teamLeaderId.toString(),
        InputValidationMessageEnum.INVALID_TEAM_LEADER,
      );
    }

    if (
      !this.checkNotificationExist(
        request.notificationId,
        NotificationTypeEnum.ESL_OFFSET,
      )
    ) {
      this.addError(
        request.notificationId!.toString(),
        InputValidationMessageEnum.INVALID_NOTIFICATION,
      );
    }

    return this.getErrors();
  }
}
