import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { TimeEntry } from '@prisma/client';

@Injectable()
export class DtrManagementService {
  constructor(private readonly prisma: PrismaService) {}
  async timeEntries(): Promise<TimeEntry[]> {
    return this.prisma.timeEntry.findMany({
      include: {
        user: {
          include: {
            position: true,
          },
        },
        timeIn: true,
        timeOut: true,
        overtime: true,
        changeShiftRequest: true,
        workInterruptions: true,
        eslOffsets: true,
      },
    });
  }
}
