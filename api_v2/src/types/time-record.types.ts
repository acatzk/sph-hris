import { Prisma } from '@prisma/client'

export type TimeEntriesWithRelations = Prisma.TimeEntryGetPayload<{
    include: {
        user: true,
        workInterruptions: true,
        eslChangeShiftRequests: true,
        eslOffsets: true,
        timeIn: true,
        timeOut: true,
    }
}>;