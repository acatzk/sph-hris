import {
  CreateInterruptionRequestInput,
  WorkInterruptionDTO,
  ShowInterruptionRequestInput,
  WorkInterruption,
  WorkInterruptionType,
} from '@/graphql/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { formatDate, getCurrentDate } from '../utilities/date.util';

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

  /**
   * Retrieves work interruptions by time entry ID.
   *
   * @param {ShowInterruptionRequestInput} interruption - The input containing the time entry ID.
   * @returns {Promise<WorkInterruptionDTO[]>} The list of work interruptions DTOs.
   */
  async interruptionsByTimeEntryId(
    interruption: ShowInterruptionRequestInput,
  ): Promise<WorkInterruptionDTO[]> {
    const interruptions = await this.prisma.workInterruption.findMany({
      where: {
        timeEntryId: interruption.timeEntryId,
      },
      include: {
        workInterruptionType: true,
      },
    });

    return interruptions.map(this.mapWorkInterruption.bind(this)); // Using bind(this) to maintain context
  }

  /**
   * Maps a single work interruption from the database model to the DTO.
   *
   * @param {WorkInterruption} interruption - The work interruption object from the database.
   * @returns {WorkInterruptionDTO} The mapped work interruption DTO.
   */
  private mapWorkInterruption(
    interruption: WorkInterruption,
  ): WorkInterruptionDTO {
    const mappedInterruption: WorkInterruptionDTO = {
      id: interruption.id,
      timeOut: interruption.timeOut
        ? interruption.timeOut.toISOString().slice(11, 19)
        : null,
      timeIn: interruption.timeIn
        ? interruption.timeIn.toISOString().slice(11, 19)
        : null,
      workInterruptionTypeId: interruption.workInterruptionTypeId,
      timeEntryId: interruption.timeEntryId,
      otherReason: interruption.otherReason || null,
      remarks: interruption.remarks || null,
      workInterruptionType: interruption.workInterruptionType
        ? this.mapWorkInterruptionType(interruption.workInterruptionType)
        : null,
      createdAt: interruption.createdAt ? getCurrentDate : null,
    };
    return mappedInterruption;
  }
  /**
   * Maps the work interruption type from the database model to the DTO.
   *
   * @param {WorkInterruptionType} type - The work interruption type from the database.
   * @returns {WorkInterruptionType | null} The mapped work interruption type DTO.
   */
  private mapWorkInterruptionType(
    type: WorkInterruptionType,
  ): WorkInterruptionType | null {
    return {
      id: type.id,
      name: type.name || null,
      workInterruption: type.workInterruption
        ? type.workInterruption.map(this.mapWorkInterruption)
        : [],
      createdAt: type.createdAt ? getCurrentDate : null,
      updatedAt: type.updatedAt ? getCurrentDate : null,
    };
  }
}
