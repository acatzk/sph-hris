import { Injectable } from '@nestjs/common';
import { TimeInRequestInput } from '@/graphql/graphql';
import { TimeEntry } from '@/prisma/classes/time_entry';
import { InputValidationMessageEnum } from '@/enums/input-validation-message.enum';

@Injectable()
export class TimeInServiceInputValidation {
  constructor() {}

  async checkTimeInRequestInput(
    timeIn: TimeInRequestInput,
    time_entry: TimeEntry,
  ) {
    const errors: string[] = [];

    if (timeIn.timeHour > time_entry.startTime && !timeIn.remarks) {
      errors.push(
        timeIn.remarks!,
        InputValidationMessageEnum.REQUIRED_TIME_IN_REMARKS,
      );
    }

    return errors;
  }
}
