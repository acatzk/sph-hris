import {
  CreateInterruptionRequestInput,
  UpdateInterruptionRequestInput,
} from '@/graphql/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { formatDate, formatToISO } from '../utilities/date.util';

@Injectable()
export class WorkInterruptionService {
  constructor(private prisma: PrismaService) {}

  /**
   * function that check and create a work interruption
   *
   * @param interruption TimeEntryId and WorkInterruptionTypeId are required
   * @returns the Id of the new work interruption maded
   */

  async create(interruption: CreateInterruptionRequestInput) {
    if (!interruption.timeEntryId) {
      throw new BadRequestException('timeEntryId is required');
    }

    if (!interruption.workInterruptionTypeId) {
      throw new BadRequestException('workInterruptionTypeId is required');
    }

    try {
      const hasTimeEntry = await this.prisma.timeEntry.findUnique({
        where: { id: interruption.timeEntryId },
      });

      const hasInterruptionType =
        await this.prisma.workInterruptionType.findUnique({
          where: { id: interruption.workInterruptionTypeId },
        });

      if (!hasTimeEntry || !hasInterruptionType) {
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
            ? formatDate(interruption.timeOut, 'HH:mm:ss')
            : null,
          timeIn: interruption.timeIn
            ? formatDate(interruption.timeIn, 'HH:mm:ss')
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

  async updateInterruption(
    interruption: UpdateInterruptionRequestInput,
  ): Promise<boolean> {
    const { id, ...updateData } = interruption;

    try {
      const updatedInterruption = await this.prisma.workInterruption.update({
        where: { id },
        data: {
          ...updateData,
          timeOut: interruption.timeOut
            ? formatToISO(interruption.timeOut)
            : null,
          timeIn: interruption.timeIn ? formatToISO(interruption.timeIn) : null,
          timeEntryId: undefined,
          createdAt: undefined,
        },
      });

      return !!updatedInterruption;
    } catch (error) {
      console.error('Error updating interruption:', error);
      return false;
    }
  }
}
