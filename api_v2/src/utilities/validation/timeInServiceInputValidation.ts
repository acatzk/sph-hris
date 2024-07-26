import { PrismaService } from '@/prisma/prisma.service';
import {
  CustomInputValidation,
  ICustomValidationException,
} from '../validation.util';
import { TimeEntry, TimeInRequestInput } from '@/graphql/graphql';
import { InputValidationMessageEnum } from '@/enums/input-validation-message.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeInServiceInputValidation extends CustomInputValidation {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  /**
   * Function that validate the timein of the user if it is late or not
   * @param timeIn
   * @param timeEntry
   * @returns Error message or null
   */
  public async checkTimeInRequestInput(
    timeIn: TimeInRequestInput,
    timeEntry: TimeEntry,
  ): Promise<ICustomValidationException | null> {
    this.clearErrors();

    if (timeIn.timeHour > timeEntry.startTime && timeIn.remarks == '') {
      this.addError(
        timeIn.remarks.toString(),
        InputValidationMessageEnum.REQUIRED_TIME_IN_REMARKS,
      );
    }

    return this.getErrors();
  }
}
