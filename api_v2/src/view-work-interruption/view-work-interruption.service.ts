import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { WorkInterruptionDTO } from '@/graphql/graphql';
import { ShowInterruptionRequestInput } from '@/graphql/graphql';
import { DateTime } from 'luxon';
import { WorkInterruptionType } from '@/graphql/graphql';

@Injectable()
export class InterruptionService {
  constructor(private prisma: PrismaService) {}
  /**
   * Retrieves work interruptions by time entry ID.
   *
   * @param {ShowInterruptionRequestInput} interruption - The input containing the time entry ID.
   * @returns {Promise<WorkInterruptionDTO[]>} The list of work interruptions.
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

    return interruptions.map((interruption) => ({
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
      workInterruptionType: this.mapWorkInterruptionType(
        interruption.workInterruptionType,
      ),
      createdAt:
        interruption.createdAt instanceof Date
          ? interruption.createdAt.toISOString()
          : null,
    }));
  }
  /**
   * Maps the work interruption type from the database model to the DTO.
   *
   * @param {any} type - The work interruption type from the database.
   * @returns {WorkInterruptionType | null} The mapped work interruption type.
   */
  private mapWorkInterruptionType(type: any): WorkInterruptionType | null {
    if (!type) {
      return null;
    }
    return {
      id: type.id,
      name: type.name || null,
      workInterruption: type.workInterruption || [],
      createdAt:
        type.createdAt instanceof Date
          ? DateTime.fromJSDate(type.createdAt)
          : null,
      updatedAt:
        type.updatedAt instanceof Date
          ? DateTime.fromJSDate(type.updatedAt)
          : null,
    };
  }
}
