import { Injectable } from '@nestjs/common';
import {
  CustomInputValidation,
  ICustomValidationException,
} from '../validation.util';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBulkOvertimeRequestInput } from '@/graphql/graphql';
import { InputValidationMessageEnum } from '@/enums/input-validation-message.enum';

@Injectable()
export class OvertimeServiceInputValidation extends CustomInputValidation {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  /**
   * Function that validate a group of overtime request
   * @param request
   * @returns Error message or null
   */
  public async checkBulkOvertimeRequestInput(
    request: CreateBulkOvertimeRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();
    let index = 0;

    if (!this.checkUserExist(request.managerId)) {
      this.addError(
        request.managerId.toString(),
        InputValidationMessageEnum.INVALID_MANAGER,
        index,
      );
    }

    if (!this.checkDateFormat(request.date)) {
      this.addError(
        request.date.toString(),
        InputValidationMessageEnum.INVALID_DATE,
        index,
      );
    }

    if (!this.checkProjectExist(request.projectId)) {
      this.addError(
        request.projectId.toString(),
        InputValidationMessageEnum.INVALID_PROJECT,
        index,
      );
    }

    request.employeeIds.forEach((id) => {
      if (!this.checkUserExist(id)) {
        this.addError(
          id.toString(),
          InputValidationMessageEnum.INVALID_USER_ID,
          index,
        );
      }
      index++;
    });

    return this.getErrors();
  }
}
