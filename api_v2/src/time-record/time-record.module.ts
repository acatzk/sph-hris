import { Module } from '@nestjs/common';
import { TimeRecordResolver } from './time-record.resolver';
import { TimeRecordService } from './time-record.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [TimeRecordResolver, TimeRecordService, PrismaService],
})
export class TimeRecordModule {}
