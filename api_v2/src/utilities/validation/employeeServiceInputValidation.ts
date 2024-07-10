import { PrismaService } from '@/prisma/prisma.service';
import {
  CustomInputValidation,
  ICustomValidationException,
} from '../validation.util';
import { AddNewEmployeeRequestInput } from '@/graphql/graphql';
import { InputValidationMessageEnum } from '@/enums/input-validation-message.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeServiceInputValidation extends CustomInputValidation {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  /**
   * Function that validate the user input for a new member or employee
   * @param request
   * @returns Error message or null
   */
  public async CheckAddNewEmployeeRequestInput(
    request: AddNewEmployeeRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (!this.checkEmailFormat(request.email)) {
      this.addError(
        request.email.toString(),
        InputValidationMessageEnum.INVALID_EMAIL,
      );
    }

    if (!this.checkPositionExist(request.positionId)) {
      this.addError(
        request.positionId.toString(),
        InputValidationMessageEnum.INVALID_POSITION,
      );
    }

    if (!this.checkRoleExist(request.roleId)) {
      this.addError(
        request.roleId.toString(),
        InputValidationMessageEnum.INVALID_ROLE,
      );
    }

    if (
      request.scheduleId != null &&
      !this.checkScheduleExist(request.scheduleId)
    ) {
      this.addError(
        request.scheduleId.toString(),
        InputValidationMessageEnum.INVALID_SCHEDULE,
      );
    }

    if (request.firstName == '') {
      this.addError(
        request.roleId.toString(),
        InputValidationMessageEnum.INVALID_FIRST_NAME,
      );
    }

    if (request.middleName == '') {
      this.addError(
        request.roleId.toString(),
        InputValidationMessageEnum.INVALID_MIDDLE_NAME,
      );
    }

    if (request.lastName == '') {
      this.addError(
        request.roleId.toString(),
        InputValidationMessageEnum.INVALID_LAST_NAME,
      );
    }

    return this.getErrors();
  }
}
