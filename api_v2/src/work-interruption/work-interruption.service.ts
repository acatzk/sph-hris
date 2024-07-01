import { CreateInterruptionRequestInput } from '@/graphql/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class WorkInterruptionService {
  constructor(private prisma: PrismaService) {}

  async create(interruption: CreateInterruptionRequestInput) {
    if (!interruption.timeEntryId) {
      throw new BadRequestException('timeEntryId is required');
    }

    if (!interruption.workInterruptionTypeId) {
      throw new BadRequestException('workInterruptionTypeId is required');
    }

    try {
      const has_timeEntry = await this.prisma.timeEntry.findUnique({
        where: { id: interruption.timeEntryId },
      });

      const has_interruptionType =
        await this.prisma.workInterruptionType.findUnique({
          where: { id: interruption.workInterruptionTypeId },
        });

      if (!has_timeEntry || !has_interruptionType) {
        throw new NotFoundException(
          'TimeEntry or WorkInterruptionType not found',
        );
      }

      const createdInterruption = await this.prisma.workInterruption.create({
        data: {
          timeEntryId: interruption.timeEntryId,
          workInterruptionTypeId: interruption.workInterruptionTypeId,
          otherReason: interruption.otherReason || null,
          timeOut: interruption.timeOut
            ? moment(interruption.timeOut, 'HH:mm:ss').toISOString()
            : null,
          timeIn: interruption.timeIn
            ? moment(interruption.timeIn, 'HH:mm:ss').toISOString()
            : null,
          remarks: interruption.remarks || null,
        },
      });

      return createdInterruption;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'An error occurred while creating the interruption',
      );
    }
  }
}
