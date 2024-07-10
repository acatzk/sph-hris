import { PrismaService } from '@/prisma/prisma.service';
import {
  CustomInputValidation,
  ICustomValidationException,
} from '../validation.util';
import { ChangeSchedRequestInput } from '@/graphql/graphql';
import { InputValidationMessageEnum } from '@/enums/input-validation-message.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeScheduleServiceInputValidation extends CustomInputValidation {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  /**
   * Function that check if user changeSchedule request is valid
   * @param request
   * @returns Error message or null
   */
  public async checkChangeScheduleRequestInput(
    request: ChangeSchedRequestInput,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    request.leaderIds.forEach(async (userId) => {
      const validLeader = await this.checkProjectLeaderUser(userId);

      if (!validLeader) {
        this.addError(
          userId.toString(),
          InputValidationMessageEnum.INVALID_TEAM_LEADER,
        );
      }
    });

    return this.getErrors();
  }
}
