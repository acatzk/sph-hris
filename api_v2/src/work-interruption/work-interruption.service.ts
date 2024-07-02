import {
  CreateInterruptionRequestInput,
  WorkInterruptionType,
  WorkInterruptionDTO,
  ShowInterruptionRequestInput,
} from '@/graphql/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { formatDate, getCurrentDate } from '../utilities/date.util';

interface WorkInterruption {
  id: number;
  timeOut: Date | null;
  timeIn: Date | null;
  workInterruptionTypeId: number;
  timeEntryId: number;
  otherReason: string | null;
  remarks: string | null;
  createdAt: Date | null;
  workInterruptionType: WorkInterruptionType;
}

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
   * Retrieves interruptions for a specific time entry ID.
   *
   * @param {ShowInterruptionRequestInput} interruption - The request input containing the time entry ID.
   * @returns {Promise<WorkInterruptionDTO[]>} A promise that resolves to an array of WorkInterruptionDTO objects.
   */
  async interruptionsByTimeEntryId(
    interruption: ShowInterruptionRequestInput,
  ): Promise<WorkInterruptionDTO[]> {
    const interruptions = await this.fetchInterruptions(interruption);
    return this.mapInterruptions(interruptions);
  }

  /**
   * Fetches interruptions from the database based on the given criteria.
   *
   * @param {ShowInterruptionRequestInput} interruption - The request input containing the time entry ID.
   * @returns {Promise<WorkInterruption[]>} A promise that resolves to an array of WorkInterruption objects.
   */
  private async fetchInterruptions(
    interruption: ShowInterruptionRequestInput,
  ): Promise<WorkInterruption[]> {
    const dbInterruptions = await this.prisma.workInterruption.findMany({
      where: {
        timeEntryId: interruption.timeEntryId,
      },
      include: {
        workInterruptionType: true,
      },
    });
    return dbInterruptions.map((interruption) =>
      this.mapInterruption(interruption),
    );
  }

  /**
   * Maps an array of WorkInterruption objects to an array of WorkInterruptionDTO objects.
   *
   * @param {WorkInterruption[]} interruptions - The array of WorkInterruption objects to map.
   * @returns {WorkInterruptionDTO[]} An array of mapped WorkInterruptionDTO objects.
   */
  private mapInterruptions(
    interruptions: WorkInterruption[],
  ): WorkInterruptionDTO[] {
    return interruptions.map((interruption) =>
      this.mapInterruptionToDTO(interruption),
    );
  }

  /**
   * Maps a single WorkInterruption object to a WorkInterruptionDTO object.
   *
   * @param {WorkInterruption} interruption - The WorkInterruption object to map.
   * @returns {WorkInterruptionDTO} The mapped WorkInterruptionDTO object.
   */
  private mapInterruption(interruption: any): WorkInterruption {
    return {
      id: interruption.id,
      timeOut: interruption.timeOut ?? null,
      timeIn: interruption.timeIn ?? null,
      workInterruptionTypeId: interruption.workInterruptionTypeId,
      timeEntryId: interruption.timeEntryId,
      otherReason: interruption.otherReason ?? null,
      remarks: interruption.remarks ?? null,
      workInterruptionType: this.mapWorkInterruptionType(
        interruption.workInterruptionType,
      ),
      createdAt: interruption.createdAt ?? null,
    };
  }

  /**
   * Maps a single WorkInterruption object to a WorkInterruptionDTO object with formatted dates.
   *
   * @param {WorkInterruption} interruption - The WorkInterruption object to map.
   * @returns {WorkInterruptionDTO} The mapped WorkInterruptionDTO object with formatted dates.
   */
  private mapInterruptionToDTO(
    interruption: WorkInterruption,
  ): WorkInterruptionDTO {
    return {
      id: interruption.id,
      timeOut: interruption.timeOut
        ? interruption.timeOut.toISOString().slice(11, 19)
        : null,
      timeIn: interruption.timeIn
        ? interruption.timeIn.toISOString().slice(11, 19)
        : null,
      workInterruptionTypeId: interruption.workInterruptionTypeId,
      timeEntryId: interruption.timeEntryId,
      otherReason: interruption.otherReason,
      remarks: interruption.remarks,
      workInterruptionType: this.mapWorkInterruptionType(
        interruption.workInterruptionType,
      ),
      createdAt: interruption.createdAt
        ? interruption.createdAt.toISOString()
        : null,
    };
  }

  /**
   * Maps a WorkInterruptionType object to a simplified representation.
   *
   * @param {WorkInterruptionType} type - The WorkInterruptionType object to map.
   * @returns {WorkInterruptionType} A simplified representation of the WorkInterruptionType object.
   */
  private mapWorkInterruptionType(
    type: WorkInterruptionType,
  ): WorkInterruptionType {
    return {
      id: type.id,
      name: type.name ?? null,
      workInterruption: type.workInterruption ?? [],
      createdAt: type.createdAt ? getCurrentDate : null,
      updatedAt: type.updatedAt ? getCurrentDate : null,
    };
  }
}
